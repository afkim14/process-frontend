/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie-player'
import Text from "@/app/components/text/text";
import AnimatedDiv from '../components/animated/animatedDiv/animatedDiv';
import Button from '../components/buttons/button/button';
import Api from '@/lib/api';

import { openLink } from '@/utils/helpers';
import { TERMS_AND_CONDITIONS_URL } from '@/utils/constants';

import { useUserContext } from "@/lib/context/UserContext";
import maleThinkingJson from '../../lib/lottie/male-thinking.json';
import femaleThinkingJson from '../../lib/lottie/female-thinking.json';
import femaleEnlightedJson from '../../lib/lottie/female-enlightened.json';
import checkJson from '../../lib/lottie/check.json';
import styles from "./page.module.css";

export default function Onboarding() {
    const router = useRouter();
    const { user } = useUserContext();
    const [step, setStep] = useState<number>(0);

    return (
        <div className={styles.page}>
            {step === 0 && (
                <OnboardingCard>
                    <Lottie
                        className={styles.lottie}
                        loop
                        animationData={maleThinkingJson}
                        style={{ width: "50%", marginBottom: -50 }}
                        play
                        speed={1}
                    />
                    <Text className={styles.onboardingHeader} text="Start with a question" h1 />
                    <Text className={styles.onboardingSubheader} text={"What has been on your mind? These can range from big questions like \"What's the meaning of life?\" to smaller ones like \"Where should I travel next?\"."} />
                    <div className={styles.onboardingButtonContainer}>
                        <div />
                        <Button className={styles.onboardingButton} text="Next" onClick={() => setStep(step + 1)} />
                    </div>
                </OnboardingCard>
            )}
            {step === 1 && (
                <OnboardingCard>
                    <Lottie
                        className={styles.lottie}
                        loop
                        animationData={femaleThinkingJson}
                        style={{ width: "40%" }}
                        play
                        speed={1}
                    />
                    <Text className={styles.onboardingHeader} text="Deep-dive to find the answer(s)" h1 />
                    <Text className={styles.onboardingSubheader} text="Big questions usually need to be broken down to effectively answer them. Process helps you by suggesting smaller questions to address first, while keeping the bigger goal always in mind." />
                    <div className={styles.onboardingButtonContainer}>
                        <Button className={styles.onboardingButton} text="Back" onClick={() => setStep(step - 1)} inversed />
                        <Button className={styles.onboardingButton} text="Next" onClick={() => setStep(step + 1)} />
                    </div>
                </OnboardingCard>
            )}
            {step === 2 && (
                <OnboardingCard>
                    <Lottie
                        className={styles.lottie}
                        loop
                        animationData={femaleEnlightedJson}
                        style={{ width: "40%" }}
                        play
                        speed={1}
                    />
                    <Text className={styles.onboardingHeader} text="Continue exploring the unknown" h1 />
                    <Text className={styles.onboardingSubheader} text="Questions tend to lead to other questions. Explore topics that you've been wanting to learn more about. It all starts with another question." />
                    <div className={styles.onboardingButtonContainer}>
                        <Button className={styles.onboardingButton} text="Back" onClick={() => setStep(step - 1)} inversed />
                        <Button className={styles.onboardingButton} text="Next" onClick={() => setStep(step + 1)} />
                    </div>
                </OnboardingCard>
            )}
            {step === 3 && (
                <OnboardingCard>
                    <Lottie
                        className={styles.lottie}
                        animationData={checkJson}
                        style={{ width: "30%" }}
                        play
                        speed={1}
                        loop={false}
                    />
                    <Text className={styles.onboardingHeader} text="Terms and Conditions" h1 />
                    <Text className={styles.onboardingSubheader} text="Before continuing, please accept our Terms and Conditions. It's important that you read and understand them before continuing to use our services." />
                    <Button
                        className={styles.termsAndConditionsButton} 
                        text="Terms and Conditions" 
                        onClick={() => { openLink(TERMS_AND_CONDITIONS_URL) }} 
                        inversed 
                    />
                    <div className={styles.onboardingButtonContainer}>
                        <Button className={styles.onboardingButton} text="Back" onClick={() => setStep(step - 1)} inversed />
                        <Button
                            className={styles.onboardingButton} 
                            text="Accept" 
                            onClick={() => {
                                Api.post('/user/me/terms-and-conditions/accept')
                                    .then(() => {
                                        router.push('/');
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }} 
                        />
                    </div>
                </OnboardingCard>
            )}
        </div>
    );
}

function OnboardingCard({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <AnimatedDiv className={styles.onboardingCard}>
            {children}
        </AnimatedDiv>
    )
}