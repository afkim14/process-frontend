/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie-player'
import Text from "@/app/components/text/text";
import AnimatedDiv from '../components/animated/animatedDiv/animatedDiv';
import Button from '../components/buttons/button/button';

import { openLink } from '@/utils/helpers';
import { PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from '@/utils/constants';

import femaleThinkingJson from '../../lib/lottie/female-thinking.json';
import stackJson from '../../lib/lottie/many.json';
import femaleEnlightedJson from '../../lib/lottie/female-enlightened.json';
import writeJson from '../../lib/lottie/write.json';
import spiralJson from '../../lib/lottie/spiral.json';
import styles from "./page.module.css";

export default function About() {
    const router = useRouter();
    
    return (
        <div className={styles.page}>
            <div className={styles.headerOuterContainer}>
                <AnimatedDiv className={styles.headerContainer}>
                    <Lottie
                        className={styles.spiral}
                        loop
                        animationData={spiralJson}
                        style={{ width: "70%", minWidth: 500 }}
                        play
                        speed={0.3}
                    />
                    <img className={styles.logo} src="logo-white.png" alt="Process Logo" />
                    <div className={styles.nameContainer}>
                        <Text className={styles.name} text="Process" bold />
                        <Text className={styles.beta} text="BETA" />
                    </div>
                    <Text className={styles.slogan} text="Fulfill your curiosity" />
                    <Button 
                        className={styles.ctaButton} 
                        text="Start Exploring"
                        onClick={(): void => { router.push('/') }} 
                        inversed
                    />
                </AnimatedDiv>
            </div>
            <AnimatedDiv className={styles.section}>
                <Lottie
                    loop
                    animationData={femaleThinkingJson}
                    style={{ width: "40%" }}
                    play
                    speed={1}
                />
                <Text className={styles.sectionHeader} text="Everything starts with a question." bold />
                <Text className={styles.quote} text={"\"Questions are places in your mind where answers fit. If you haven't asked the question, the answer has nowhere to go.\""} italic />
                <Text className={styles.quoteAuthor} text="Clayton Christensen" bold />
            </AnimatedDiv>
            <AnimatedDiv className={styles.section}>
                <Lottie
                    loop
                    animationData={stackJson}
                    style={{ width: "40%" }}
                    play
                    speed={1}
                />
                <Text className={styles.sectionHeader} text="Important questions rarely have a single answer." bold />
                <Text className={styles.sectionBody} text={'Most questions that we struggle with are multi-faceted and have multiple “right” answers. Process helps you break down large questions into smaller ones to better address your thoughts.'} />
            </AnimatedDiv>
            <AnimatedDiv className={styles.section}>
                <Lottie
                    loop
                    animationData={femaleEnlightedJson}
                    style={{ width: "50%" }}
                    play
                    speed={1}
                />
                <Text className={styles.sectionHeader} text={"Write to learn. Hone your critical thinking skills.\nDive deep."} bold />
                <Text className={styles.sectionBody} text={'Writing is known to be a powerful tool for information processing and retention. We believe that providing a space for you to answer questions via writing is the best way to dive deep.'} />
            </AnimatedDiv>
            <AnimatedDiv className={styles.section}>
                <Lottie
                    loop
                    animationData={writeJson}
                    style={{ width: "40%" }}
                    play
                    speed={0.5}
                />
                <Text className={styles.sectionHeader} text={"Be a producer instead of a consumer."} bold />
                <Text className={styles.sectionBody} text={'With the exponential growth of information online, many have become more of consumers rather than producers. We believe learning by doing is better than simply reading or watching information online.'} />
            </AnimatedDiv>
            <AnimatedDiv className={styles.section}>
                <Text className={styles.sectionHeader} text={"Improve the model inside you."} bold />
                <Text className={styles.sectionBody} text={'Many apps focus on using user data to improve the systems instead of the user. By guiding the user through an explorative writing process, we aim to improve the thinking and knowledge models inside the user. The process becomes more important than the output.'} />
            </AnimatedDiv>
            <div className={styles.footer}>
                <div className={styles.footerColumn}>
                    <Text className={styles.footerHeader} text="Terms & Policies" bold />
                    <Text className={styles.footerText} text="Terms & Conditions" onClick={() => openLink(TERMS_AND_CONDITIONS_URL, true)} />
                    <Text className={styles.footerText} text="Privacy Policy" onClick={() => openLink(PRIVACY_POLICY_URL, true)} />
                </div>
                <div className={styles.footerColumn}>
                    <Text className={styles.footerHeader} text="Platform" bold />
                    <Text className={styles.footerText} text="Pricing" />
                </div>
            </div>
        </div>
    );
}