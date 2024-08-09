/* eslint-disable @next/next/no-img-element */
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie-player'
import Text from "@/app/components/text/text";
import AnimatedDiv from '../components/animated/animatedDiv/animatedDiv';
import { useUserContext } from "@/lib/context/UserContext";
import waveLottieJson from '../../lib/lottie/wave.json';
import styles from "./page.module.css";

export default function Login() {
    const router = useRouter();
    const { login } = useUserContext();
    const [isHoveringLogin, setIsHoveringLogin] = useState(false);
    
    return (
        <div className={styles.page}>
            <AnimatedDiv className={styles.loginContainer}>
                <img className={styles.logo} src="/logo-dark.png" alt="logo" />
                <Text className={styles.loginHeader} text="Sign in" bold />
                <Text className={styles.subheader} text="Let's start thinking." />
                <div 
                    className={styles.signInWithGoogleBtn} 
                    onClick={login}
                    onMouseEnter={() => setIsHoveringLogin(true)}
                    onMouseLeave={() => setIsHoveringLogin(false)}
                >
                    <Text className={styles.signInWithGoogleBtnText} text="Login with Google" />
                </div>
                <Text className={styles.learnMoreText} text="Learn more about Process" onClick={() => { router.push('/about') }} />
            </AnimatedDiv>
            <AnimatedDiv className={styles.onboardingContainer}>
                <Lottie
                    loop
                    animationData={waveLottieJson}
                    style={{ width: "50%" }}
                    play
                    speed={0.8}
                />
            </AnimatedDiv>
        </div>
    );
}
