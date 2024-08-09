"use client"
import React from 'react';
import ClassNameSingleton from '../../../../utils/className';
import { motion } from 'framer-motion';
import styles from './animatedDiv.module.css'

interface AnimatedDivProps {
    ref?: any;
    className?: string;
    style? : React.CSSProperties;
    children: React.ReactNode;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
}

export default function AnimatedDiv({
    ref,
    className,
    style,
    children,
    onMouseEnter,
    onMouseLeave,
    onClick
}: AnimatedDivProps) { 
    return (
        <motion.div 
            ref={ref}
            className={ClassNameSingleton.combine([
                styles.container,
                className || ''
            ])}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}