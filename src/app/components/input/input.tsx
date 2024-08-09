"use client"
import React from 'react';
import SubmitButton from '../buttons/submitButton/submitButton';
import ClassNameSingleton from '../../../utils/className';
import styles from './input.module.css'

interface InputProps {
    className?: string;
    inputClassName?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    includeSubmitBtn?: boolean;
    onSubmit?: () => void;
    submitDisabled?: boolean;
    autofocus?: boolean;
    height?: number;
}

export default function Input({
    className,
    inputClassName,
    style,
    placeholder,
    value,
    onChange,
    includeSubmitBtn,
    onSubmit,
    submitDisabled,
    autofocus,
    height
}: InputProps) {
    const inputHeight = height || 50;
    return (
        <div
            className={ClassNameSingleton.combine([
                styles.inputContainer,
                className || ''
            ])}
        >
            <form className={styles.form} onSubmit={(e): void => { e.preventDefault(); onSubmit && onSubmit() }}>
                <input
                    className={ClassNameSingleton.combine([
                        styles.input,
                        inputClassName || ''
                    ])}
                    style={{
                        ...style,
                        height: inputHeight
                    }}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoFocus={autofocus}
                />
            </form>
            {includeSubmitBtn && (
                <SubmitButton
                    style={{
                        marginLeft: 10,
                        width: inputHeight - 5,
                        height: inputHeight -5
                    }}
                    onClick={onSubmit}
                    disabled={submitDisabled}
                />
            )}
        </div>
    )
}