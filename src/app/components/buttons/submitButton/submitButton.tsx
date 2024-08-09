/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import ClassNameSingleton from '../../../../utils/className';
import styles from './submitButton.module.css'

interface SubmitButtonProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export default function SubmitButton({
    className,
    style,
    children,
    onClick,
    disabled
}: SubmitButtonProps) {
    return (
        <div 
            className={ClassNameSingleton.combine([
                styles.submitButton,
                disabled ? styles.disabled : "",
                className || ''
            ])}
            style={style}
            onClick={(): void => { !disabled && onClick && onClick() }}
        >
            {children || (
                <img
                    className={styles.arrow}
                    src="/icons/arrow_white.png" 
                    alt="submit" 
                />
            )}
        </div>
    )
}