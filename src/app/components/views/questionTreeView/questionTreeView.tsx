/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useRef, useEffect } from 'react';

import Text from "@/app/components/text/text";
import Input from "@/app/components/input/input";
import AnimatedDiv from '@/app/components/animated/animatedDiv/animatedDiv';
import Button from '@/app/components/buttons/button/button';
import Loading from '../../animated/loading/loading';

import Api from '@/lib/api';

import { Question } from '@/utils/types';
import { isValidQuestion } from '@/utils/helpers';
import ClassNameSingleton from '@/utils/className';
import styles from "./questionTreeView.module.css";

type QuestionTreeNode = {
    question_text: string;
    children: Array<QuestionTreeNode>;
    showChildren: boolean;
    isLoadingChildren: boolean;
    generatedBy: 'user' | 'system';
}

interface QuestionTreeViewProps {
    existingQuestion?: {
        rootQuestion: Question;
        question: Question;
    };
    newQuestionText?: string;
    onSelectQuestion: (question: string) => void;
}

const MAX_DEPTH = 3;

export default function QuestionTreeView({
    existingQuestion,
    newQuestionText,
    onSelectQuestion
}: QuestionTreeViewProps) {
    const [newQuestion, setNewQuestion] = useState<string>('');
    const [questionTreeNode, setQuestionTreeNode] = useState<QuestionTreeNode>({
        question_text: existingQuestion?.question.question_text || newQuestionText || '',
        children: [],
        showChildren: true,
        isLoadingChildren: true,
        generatedBy: 'user'
    });
    const [selectedQuestionTreeNode, setSelectedQuestionTreeNode] = useState<QuestionTreeNode | undefined>(undefined);
    const effectRan = useRef(false);

    useEffect((): any => {
        if (!effectRan.current) {
            let body = {};
            if (existingQuestion) {
                body = {
                    main_question_text: existingQuestion.rootQuestion.question_text,
                    subquestion_text: existingQuestion.question.question_text,
                    existing_subquestions: getAllExistingSubquestionsFromRoot()
                }
            } else if (newQuestionText) {
                body = {
                    main_question_text: newQuestionText, 
                    subquestion_text: newQuestionText,
                    existing_subquestions: [] 
                }
            }

            Api.post('/question/subquestions', body)
                .then((res) => {
                    const { questions } = res.data as { questions: Array<string> };
                    questionTreeNode.children = questions.map((question) => ({
                        question_text: question,
                        children: [],
                        showChildren: true,
                        isLoadingChildren: false,
                        generatedBy: 'system'
                    }));
                    questionTreeNode.isLoadingChildren = false;
                    setQuestionTreeNode({ ...questionTreeNode });
                }).catch((err) => {
                // todo: handle error
                    console.log(err);
                })
        }

        return () => effectRan.current = true;
    }, []);

    const getAllExistingSubquestionsFromRoot = (): Array<string> => {
        const existing_subquestions: Array<string> = [];
        if (!existingQuestion) return existing_subquestions;

        const stack = [existingQuestion.rootQuestion];
        while (stack.length > 0) {
            const node = stack.pop() as Question;
            if (node.question_text !== existingQuestion.rootQuestion.question_text) {
                existing_subquestions.push(node.question_text);
            }
            stack.push(...node.children);
        }

        return existing_subquestions;
    }

    const getAllSubquestionsInSuggestions = (): Array<string> => {
        let subquestions: Array<string> = [];
        if (!questionTreeNode) return subquestions;

        const stack = [questionTreeNode];
        while (stack.length > 0) {
            const node = stack.pop() as QuestionTreeNode;
            if (node.question_text !== questionTreeNode.question_text) {
                subquestions.push(node.question_text);
            }
            stack.push(...node.children);
        }

        return subquestions;
    }

    const constructTree = (node: QuestionTreeNode, depth: number) => {
        const isSelectedNode = node.question_text === selectedQuestionTreeNode?.question_text;
        return (
            <AnimatedDiv key={`question-${node.question_text}`} className={styles.questionContainer}>
                <div className={styles.questionHeaderContainer}>
                    {(!existingQuestion || (node.question_text !== existingQuestion.question.question_text)) && (
                        <div 
                            className={ClassNameSingleton.combine([
                                styles.questionSelectIcon,
                                isSelectedNode ? styles.questionSelectIconSelected : ''
                            ])}
                            onClick={() => { setSelectedQuestionTreeNode(node); }}
                        />
                    )}
                    <Text
                        className={ClassNameSingleton.combine([
                            styles.questionText,
                            node.generatedBy === 'system' ? styles.systemGeneratedQuestion : '',
                            node.generatedBy === 'user' ? styles.userGeneratedQuestion : ''
                        ])}
                        text={node.question_text}
                        bold={node.generatedBy === 'user'}
                    />
                    {node.isLoadingChildren ? (
                        <Loading />
                    ) : (
                        depth < MAX_DEPTH - 1 ? (
                            <img
                                className={ClassNameSingleton.combine([
                                    styles.questionExpandIcon,
                                    node.children.length > 0 ? styles.questionExpandIconSelected : ''
                                ])} 
                                src="/icons/down.png" 
                                alt="Expand"
                                onClick={(): void => {
                                    if (node.children.length === 0) {
                                        node.showChildren = true;
                                        node.isLoadingChildren = true;
                                        setQuestionTreeNode({ ...questionTreeNode });

                                        // Load more children from API (send all existing subquestions for context)
                                        let allSubquestions = getAllSubquestionsInSuggestions();
                                        if (existingQuestion) {
                                            allSubquestions = allSubquestions.concat(getAllExistingSubquestionsFromRoot());
                                        }

                                        Api.post('/question/subquestions', {
                                            main_question_text: questionTreeNode.question_text,
                                            subquestion_text: node.question_text,
                                            existing_subquestions: allSubquestions
                                        })
                                            .then((res) => {
                                                const { questions } = res.data as { questions: Array<string> };
                                                node.children = questions.map((question) => ({
                                                    question_text: question,
                                                    children: [],
                                                    showChildren: true,
                                                    isLoadingChildren: false,
                                                    generatedBy: 'system'
                                                }));
                                                node.isLoadingChildren = false;
                                                setQuestionTreeNode({ ...questionTreeNode });
                                            }).catch((err) => {
                                                // todo: handle error
                                                console.log(err);
                                            })
                                    } else {
                                        node.showChildren = !node.showChildren;
                                        setQuestionTreeNode({ ...questionTreeNode });
                                    }
                                }}
                            />
                        ) : null
                    )}
                </div>
                {node.showChildren && node.children.map((child) => constructTree(child, depth + 1))}
            </AnimatedDiv>
        );
    }

    return (
        <div className={styles.container}>
            {constructTree(questionTreeNode, 0)}
            {questionTreeNode && (
                <Input 
                    className={styles.addQuestionInput}
                    placeholder="Add a question..."
                    includeSubmitBtn
                    value={newQuestion}
                    onChange={setNewQuestion}
                    onSubmit={() => {
                        const newNode: QuestionTreeNode = {
                            question_text: newQuestion,
                            children: [],
                            showChildren: true,
                            isLoadingChildren: false,
                            generatedBy: 'user'
                        };
                        questionTreeNode.children.push(newNode);
                        setQuestionTreeNode({ ...questionTreeNode });
                        setSelectedQuestionTreeNode(newNode);
                        setNewQuestion('');
                    }}
                    submitDisabled={!isValidQuestion(newQuestion)}
                />
            )}
            <Button
                className={styles.startAnsweringButton}
                text="Start Answering"
                disabled={!selectedQuestionTreeNode}
                onClick={() => {
                    onSelectQuestion(selectedQuestionTreeNode!.question_text);
                }}
            />
        </div>
    );
}