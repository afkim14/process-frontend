/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import Text from '@/app/components/text/text';
import AnimatedDiv from '../../animated/animatedDiv/animatedDiv';
import ClassNameSingleton from '@/utils/className';
import { Suggestion } from '@/utils/types';
import styles from './suggestionCard.module.css'
import cardStyles from '../card.module.css'

interface SuggestionCardProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: (suggestion: Suggestion) => void;
    suggestion: Suggestion;
}

export default function SuggestionCard({
    className,
    style,
    onClick,
    suggestion
}: SuggestionCardProps) {
    return (
        <AnimatedDiv 
            className={ClassNameSingleton.combine([
                cardStyles.card,
                styles.suggestionCard,
                className || ''
            ])}
            style={style}
            onClick={(): void => { onClick && onClick(suggestion) }}
        >
            <div className={cardStyles.cardTitleContainer}>
                <Text 
                    className={ClassNameSingleton.combine([
                        cardStyles.cardTitle,
                        styles.suggestionTitle
                    ])}
                    text={suggestion.name}
                    bold
                />
                <img className={cardStyles.cardUrlIcon} src="/icons/share.png" alt="Open link" />
            </div>
        </AnimatedDiv>
    )
}