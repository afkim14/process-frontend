/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import Text from '../../text/text';
import ClassNameSingleton from '../../../../utils/className';
import styles from './addButton.module.css'

interface AddButtonProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    disabled?: boolean;
}

export default function AddButton({
    className,
    style,
    onClick,
    disabled
}: AddButtonProps) {
    return (
        <div 
            className={ClassNameSingleton.combine([
                styles.addButton,
                disabled ? styles.disabled : "",
                className || ''
            ])}
            style={style}
            onClick={(): void => { !disabled && onClick && onClick() }}
        >
            <Text 
                className={styles.addButtonText}
                text="+"
                bold
            />
        </div>
    )
}