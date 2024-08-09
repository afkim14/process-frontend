"use client"
import React from 'react';

import Text from '../../text/text';
import Input from '../../input/input';
import QuestionTreeView from '../../views/questionTreeView/questionTreeView';
import Modal from '../modal';

import Api from '@/lib/api';

import { Question } from '@/utils/types';
import styles from "./addQuestionModal.module.css";

interface AddQuestionModalProps {
    open: boolean;
    onClose: () => void;
    rootQuestion: Question | undefined;
    addQuestion: Question | undefined;
    onAddQuestion: (question: Question) => void;
}

export default function AddQuestionModal({
    open,
    onClose,
    rootQuestion,
    addQuestion,
    onAddQuestion
}: AddQuestionModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <div className={styles.container}>
                {rootQuestion?.id !== addQuestion?.id && (
                    <Text className={styles.rootQuestion} text={rootQuestion?.question_text || ''} />
                )}
                <Text className={styles.header} text={"What would you like to explore more?"} h1 />
                {(addQuestion && rootQuestion) && (
                    <QuestionTreeView
                        existingQuestion={{
                            question: addQuestion,
                            rootQuestion: rootQuestion
                        }}
                        onSelectQuestion={(question: string) => {
                            Api.post('/question', {
                                question_text: question,
                                parent_question_id: addQuestion.id 
                            }).then((res) => {
                                const { question } = res.data as { question: Question };
                                onAddQuestion(question);
                            }).catch((err) => {
                                // todo: handle error
                                console.log(err);
                            })
                        }}
                    />
                )}
            </div>
        </Modal>
    );
}