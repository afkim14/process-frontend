/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';

import Text from "@/app/components/text/text";
import TextEditor from '../../editor/texteditor';

import { Question } from '@/utils/types';

import styles from "./answerView.module.css";

interface AnswerViewProps {
    rootQuestion: Question | undefined;
    question: Question | undefined;
}

export default function AnswerView({
    rootQuestion,
    question,
}: AnswerViewProps) {
    if (!question || !rootQuestion) return null;

    return (
        <div className={styles.container}>
            <Text className={styles.question} text={question.question_text} semibold />
            <TextEditor
                rootQuestion={rootQuestion}
                question={question}
                autosave
            />
        </div>
    );
}