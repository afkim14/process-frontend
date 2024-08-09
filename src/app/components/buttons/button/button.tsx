/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import ClassNameSingleton from '../../../../utils/className';
import Text from '../../text/text';
import styles from './button.module.css'

interface ButtonProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    text?: string;
    inversed?: boolean;
}

export default function Button({
    className,
    style,
    children,
    onClick,
    disabled,
    text,
    inversed
}: ButtonProps) {
    return (
        <div 
            className={ClassNameSingleton.combine([
                styles.button,
                inversed ? styles.inversed : "",
                disabled ? styles.disabled : "",
                className || ''
            ])}
            style={style}
            onClick={(): void => { !disabled && onClick && onClick() }}
        >
            {children || (
                <Text
                    className={ClassNameSingleton.combine([
                        styles.buttonText,
                        inversed ? styles.inversedText : ""
                    ])}
                    text={text || ''}
                />
            )}
        </div>
    )
}