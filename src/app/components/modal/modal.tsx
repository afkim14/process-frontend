/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import styles from './modal.module.css';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({
    open,
    onClose,
    children
}: ModalProps) {
    if (!open) return null;

    return (
        <div className={styles.modal}>
            <img className={styles.backIcon} src="/icons/back.png" alt="back" onClick={onClose} />
            {children}
            <div className={styles.bottomPadding} />
        </div>
    );
}