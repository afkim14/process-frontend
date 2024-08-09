/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import Text from '@/app/components/text/text';
import AnimatedDiv from '../../animated/animatedDiv/animatedDiv';
import ClassNameSingleton from '@/utils/className';
import { Source } from '@/utils/types';
import styles from './sourceCard.module.css'
import cardStyles from '../card.module.css'

interface SourceCardProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: (source: Source) => void;
    onDelete?: (source: Source) => void;
    source: Source;
}

export default function SourceCard({
    className,
    style,
    onClick,
    onDelete,
    source
}: SourceCardProps) {
    return (
        <AnimatedDiv className={styles.sourceCardContainer}>
            <div 
                className={ClassNameSingleton.combine([
                    cardStyles.card,
                    styles.sourceCard,
                    className || ''
                ])}
                style={style}
                onClick={(): void => { onClick && onClick(source) }}
            >
                <div className={cardStyles.cardTitleContainer}>
                    <Text 
                        className={ClassNameSingleton.combine([
                            cardStyles.cardTitle,
                            styles.sourceTitle
                        ])}
                        text={source.title}
                        bold
                    />
                    <img className={cardStyles.cardUrlIcon} src="/icons/share.png" alt="Open link" />
                </div>
                <Text 
                    className={ClassNameSingleton.combine([
                        cardStyles.cardDescription,
                        styles.sourceDescription
                    ])}
                    text={source.description}
                />
                <Text 
                    className={ClassNameSingleton.combine([
                        cardStyles.cardUrl,
                        styles.sourceUrl
                    ])}
                    text={new URL(source.url).hostname}
                />
            </div>
            <div
                className={cardStyles.deleteContainer}
                onClick={(): void => { onDelete && onDelete(source) }}
            >
                <img className={cardStyles.deleteIcon} src="/icons/delete.png" alt="Delete" />
            </div>
        </AnimatedDiv>
    )
}