/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/navigation';

import { useUserContext } from "@/lib/context/UserContext";
import Text from "@/app/components/text/text";
import AnimatedDiv from '../../components/animated/animatedDiv/animatedDiv';
import Button from '../../components/buttons/button/button';
import Api from '@/lib/api';

import ClassNameSingleton from '@/utils/className';
import { Subscription } from '@/utils/types';
import { SubscriptionType } from '@/utils/constants'; 
import styles from "./page.module.css";

export default function SubscriptionPage() {
    const router = useRouter();
    const { user } = useUserContext();
    const [numQuestions, setNumQuestions] = useState<number>(-1);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [unlimitedSubscription, setUnlimitedSubscription] = useState<Subscription | null>(null);
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return;
        Api.get(`/question/count`)
            .then((res) => {
                setNumQuestions((res.data as { count: number }).count);
            })
            .catch((err) => {
                console.log(err);
            });

        Api.get('/payment/subscriptions')
            .then((res) => {
                const { subscriptions } = res.data as { subscriptions: Array<Subscription> };
                setSubscriptions(subscriptions);
                setUnlimitedSubscription(subscriptions.find(sub => sub.type === SubscriptionType.UNLIMITED) as Subscription);
            })
            .catch((err) => {
                console.log(err);
            });

        return () => {
            effectRan.current = true;
        }
    }, []);

    const startSubscription = (): void => {
        if (!unlimitedSubscription) return;
        Api.post('/payment/create-payment-intent', { subscriptionId: unlimitedSubscription.id })
            .then((res) => {
                const { url, id } = res.data as { url: string, id: string };
                window.location.href = url;
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const cancelSubscription = (): void => {

    }

    if (numQuestions === -1
        || !unlimitedSubscription
        || !user) return null;

    const questionsRemainingForFreePlan = user.subscription.limit_questions - numQuestions;
    
    return (
        <div className={styles.page}>
            {user.subscription.type === SubscriptionType.FREE && (
                <AnimatedDiv 
                    className={ClassNameSingleton.combine([
                        styles.container,
                        styles.freeContainer
                    ])}
                >
                    <div className={styles.leftSubContainer}>
                        <Text className={styles.info} style={{ color: '#1D3557' }} text="Your current plan" bold />
                        <Text className={styles.header} style={{ color: '#1D3557' }} text="Free" bold />
                        <Text className={styles.subheader} style={{ color: '#1D3557' }} text="Limited to 10 questions" />
                    </div>
                    <div className={styles.rightSubContainer}>
                        <Text
                            className={styles.detail} 
                            style={{ color: questionsRemainingForFreePlan ? '#1D3557' : '#eb2f39' }} 
                            text={questionsRemainingForFreePlan
                                ? `You can create up to ${questionsRemainingForFreePlan} more questions.`
                                : "You have reached your question limit. Upgrade to unlimited plan to create more."
                            } 
                        />
                    </div>
                </AnimatedDiv>
            )}
            <AnimatedDiv 
                className={ClassNameSingleton.combine([
                    styles.container,
                    styles.unlimitedContainer
                ])}
            >
                <div className={styles.leftSubContainer}>
                    <Text 
                        className={styles.info} 
                        text={user.subscription.type === SubscriptionType.UNLIMITED ? "Your current plan" : `$${unlimitedSubscription.price_per_month}` } 
                        bold 
                    />
                    <Text className={styles.header} text="Unlimited" bold />
                    <Text className={styles.subheader} text="Boundless knowledge exploration" />
                </div>
                <div className={styles.rightSubContainer}>
                    {user?.subscription.type === SubscriptionType.UNLIMITED ? (
                        <Button 
                            className={styles.button}
                            text="Cancel Subscription" 
                            onClick={cancelSubscription} 
                            inversed
                        />
                    ) : (
                        <Button 
                            className={styles.button}
                            text="Upgrade Now" 
                            onClick={startSubscription} 
                            inversed
                        />
                    )}
                </div>
            </AnimatedDiv>
        </div>
    );
}