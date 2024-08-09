/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useRef } from 'react';
import { Resizable } from "re-resizable";
import { motion } from 'framer-motion';

import Text from "@/app/components/text/text";
import Input from "@/app/components/input/input";
import SourceCard from '@/app/components/cards/sourceCard/sourceCard';
import SuggestionCard from '@/app/components/cards/suggestionCard/suggestionCard';
import StaticQuestionTreeView from '../../views/staticQuestionTreeView/staticQuestionTreeView';
import AddButton from '@/app/components/buttons/addButton/addButton';
import Loading from '../../animated/loading/loading';

import Api from '@/lib/api';

import { openLink, isValidUrl } from '@/utils/helpers';
import { Question, Suggestions, Suggestion, Source } from '@/utils/types';

import styles from "./questionLeftMenu.module.css";

interface QuestionLeftMenuProps {
    rootQuestion: Question | undefined;
    question: Question | undefined;
    processingQuestion: Question | undefined;
    sources: Array<Source> | undefined;
    suggestions: Suggestions | undefined;
    onSourceAdded: (source: Source) => void;
    onSourceDeleted: (source: Source) => void;
    onChangeQuestion: (question: Question) => void;
    onClickAddQuestion: (question: Question) => void;
    onClickDeleteQuestion: (question: Question) => void;
}

export default function QuestionLeftMenu({
    rootQuestion,
    question,
    processingQuestion,
    sources,
    suggestions,
    onSourceAdded,
    onSourceDeleted,
    onChangeQuestion,
    onClickAddQuestion,
    onClickDeleteQuestion
}: QuestionLeftMenuProps) {
    const [mode, setMode] = useState<string>('main');
    const [collapsed, setCollapsed] = useState<boolean>(false);

    if (collapsed) {
        return (
            <div className={styles.collapsedMenu}>
                <img
                    className={styles.openIcon} 
                    src="/icons/right.png" 
                    alt="Expand" 
                    onClick={() => setCollapsed(!collapsed)}
                />
            </div>
        );
    }

    return (
        <Resizable
            className={styles.container}
            defaultSize={{ width: 500 }}
            minWidth={300}
            maxWidth={800}
        >
            {mode === 'main' && (
                <MainMode
                    rootQuestion={rootQuestion}
                    question={question}
                    processingQuestion={processingQuestion}
                    sources={sources}
                    suggestions={suggestions}
                    onSourceAdded={onSourceAdded}
                    onSourceDeleted={onSourceDeleted}
                    onChangeQuestion={onChangeQuestion}
                    onClickAddQuestion={onClickAddQuestion}
                    onClickDeleteQuestion={onClickDeleteQuestion}
                    onCollapse={() => {
                        setCollapsed(!collapsed) 
                    }}
                />
            )}
        </Resizable>
    );
}

function MainMode({
    rootQuestion,
    question,
    processingQuestion,
    sources, 
    suggestions,
    onSourceAdded,
    onSourceDeleted,
    onChangeQuestion,
    onClickAddQuestion,
    onClickDeleteQuestion,
    onCollapse

}: {
    rootQuestion: Question | undefined,
    question: Question | undefined,
    processingQuestion: Question | undefined,
    sources: Array<Source> | undefined, 
    suggestions: Suggestions | undefined,
    onSourceAdded: (source: Source) => void,
    onSourceDeleted: (source: Source) => void,
    onChangeQuestion: (question: Question) => void,
    onClickAddQuestion: (question: Question) => void,
    onClickDeleteQuestion: (question: Question) => void;
    onCollapse: () => void;
}) {
    const [addSourceUrl, setAddSourceURL] = useState<string>('');
    const [showAddSourceInput, setShowAddSourceInput] = useState<boolean>(false);
    const suggestionsKeys: Array<string> = Object.keys(suggestions || {});

    return (
        <div>
            <div className={styles.headerContainer}>
                <Text 
                    className={styles.header} 
                    text="Deep-Dive" 
                    h2 
                />
                <img
                    className={styles.closeIcon} 
                    src="/icons/right.png" 
                    alt="Right" 
                    onClick={onCollapse}
                />
            </div>
            <StaticQuestionTreeView
                rootQuestion={rootQuestion}
                selectedQuestion={question}
                processingQuestion={processingQuestion}
                onSelectQuestion={onChangeQuestion}
                onClickAddQuestion={onClickAddQuestion}
                onClickDeleteQuestion={onClickDeleteQuestion}
            />
            <div className={styles.headerContainer}>
                <Text 
                    className={styles.header} 
                    text="Saved Sources" 
                    h2 
                />
                {(!showAddSourceInput && question) && (
                    <AddButton onClick={(): void => { setShowAddSourceInput(true); }} />
                )}
            </div>
            {showAddSourceInput && (
                <Input 
                    className={styles.addSourceInput}
                    value={addSourceUrl}
                    onChange={setAddSourceURL}
                    includeSubmitBtn
                    onSubmit={(): void => {
                        if (!question) return;
                        
                        if (!addSourceUrl) {
                            setShowAddSourceInput(false);
                            return;
                        }

                        Api.post('/source', {
                            question_id: question.id,
                            url: addSourceUrl
                        }).then((res) => {
                            setShowAddSourceInput(false);
                            setAddSourceURL('');

                            const { source } = res.data as { source: Source };
                            console.log(source);
                            onSourceAdded(source);
                        }).catch((err) => {
                            // todo: handle error with error modal
                            console.log(err);
                        })
                    }}
                    submitDisabled={!isValidUrl(addSourceUrl)}
                    placeholder='Source URL'
                    autofocus
                    height={40}
                />
            )}
            {sources !== undefined && (
                <div className={styles.sourcesContainer}>
                    {sources.length === 0 ? (
                        showAddSourceInput ? null : (
                            <Text
                                className={styles.subtext}
                                text="Add a source to support your question."
                            />
                        )
                    ) : (
                        sources.map((source) => (
                            <SourceCard
                                key={source.id}
                                source={source}
                                onClick={(source: Source) => {
                                    openLink(source.url);
                                }}
                                onDelete={(source: Source): void => {
                                    Api.delete(`/source/${source.id}`)
                                        .catch((err) => {
                                            // todo: handle error with error modal
                                            console.log(err);
                                        });
                                    onSourceDeleted(source);
                                }}
                            />
                        ))
                    )}
                </div>
            )}
            <div className={styles.headerContainer}>
                <div className={styles.leftHeaderContainer}>
                    <Text 
                        className={styles.header} 
                        text="Resources" 
                        h2 
                    />
                    {suggestions === undefined && (
                        <Loading />
                    )}
                </div>
            </div>
            {suggestions !== undefined && (
                <div className={styles.suggestionsContainer}>
                    {suggestionsKeys.length === 0 ? (
                        <Text
                            className={styles.subtext}
                            text="There are no resources."
                        />
                    ) : (
                        suggestionsKeys.map((suggestionKey, idx) => (
                            <div key={`suggestion-${idx}`} className={styles.suggestionContainer}>
                                <Text className={styles.suggestionTopic} text={`"${suggestionKey}"`} italic />
                                <div className={styles.suggestionCardsContainer}>
                                    {suggestions[suggestionKey].map((suggestion, idx) => (
                                        <SuggestionCard
                                            key={`suggestion-card-${idx}`}
                                            suggestion={suggestion}
                                            onClick={(suggestion: Suggestion) => {
                                                openLink(suggestion.url);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}