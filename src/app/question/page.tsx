"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie-player'

import QuestionLeftMenu from '../components/menu/questionLeftMenu/questionLeftMenu';
import AnswerView from '../components/views/answerView/answerView';
import AddQuestionModal from '../components/modal/addQuestionModal/addQuestionModal';

import Api from '../../lib/api';
import Route from '@/lib/route';

import { usePopupContext } from '@/lib/context/PopupContext';
import { getURLParams } from '../../utils/helpers';
import { Question, Suggestions, Suggestion, Source } from '../../utils/types';

import styles from "./page.module.css";
import globalStyles from "../globals.module.css";

export default function QuestionPage() {
    const router = useRouter();
    const [rootQuestion, setRootQuestion] = useState<Question | undefined>(undefined);
    const [question, setQuestion] = useState<Question | undefined>(undefined);
    const [addQuestion, setAddQuestion] = useState<Question | undefined>(undefined);
    const [processingQuestion, setProcessingQuestion] = useState<Question | undefined>(undefined);
    const [suggestions, setSuggestions] = useState<Suggestions | undefined>(undefined);
    const [sources, setSources] = useState<Array<Source> | undefined>([]);
    const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('');
    const { showPopup } = usePopupContext();
    const effectRan = useRef(false);

    useEffect((): any => {
        if (effectRan.current) return;
        const questionId = getURLParams("id");
        const mode = getURLParams("mode");
        setMode(mode || 'view');

        if (!questionId) {
            router.push('/unauthorized')
            return;
        }

        // Get question tree root
        Api.get(`/question/${questionId}/root`).then((res) => {
            const { question } = res.data as { question: Question };
            setRootQuestion(question);
        }).catch((err) => {
            console.error(err);
        });

        // Get current question
        Api.get(`/question/${questionId}`).then((res) => {
            const { question } = res.data as { question: Question };
            setQuestion(question);
        }).catch((err) => {
            console.error(err);
            router.push('/404');
        });

        // Get suggestions
        Api.get(`/question/${questionId}/suggestions`).then((res) => {
            const { suggestions } = res.data as { suggestions: Suggestions };
            setSuggestions(suggestions);
        }).catch((err) => {
            console.error(err);
            showPopup({ text: 'Failed to load suggestions.', type: 'error' });
        });
        
        // Get sources
        Api.get(`/question/${questionId}/sources`).then((res) => {
            const { sources } = res.data as { sources: Array<Source> };
            setSources(sources);
        }).catch((err) => {
            console.error(err);
        });

        return () => effectRan.current = true;
    }, []);

    const updateQuestion = (question: Question) => {
        router.replace(Route.getQuestionRoute(question));
        setQuestion(question);

        // Update root questions
        // Update root question
        Api.get(`/question/${question.id}/root`).then((res) => {
            const { question } = res.data as { question: Question };
            setRootQuestion(question);
        }).catch((err) => {
            console.error(err);
        });

        // Update suggestions
        setSuggestions(undefined);  
        Api.get(`/question/${question.id}/suggestions`).then((res) => {
            setSuggestions((res.data as any).suggestions as Suggestions);
        }).catch((err) => {
            console.error(err);
        });
        
        // Update sources
        setSources(undefined);
        Api.get(`/question/${question.id}/sources`).then((res) => {
            const { sources } = res.data as { sources: Array<Source> };
            setSources(sources);
        }).catch((err) => {
            console.error(err);
        });
    }

    const onDeleteQuestion = (question: Question) => {
        if (!rootQuestion) return;
        setProcessingQuestion(question);
        Api.delete(`/question/${question.id}`).then(() => {
            // If root, redirect to home
            if (rootQuestion.id === question.id) {
                router.push('/');
                return;
            }

            // If question has parent, redirect to parent
            // If not, redirect to home
            const parentQuestionId = question.parent_question_id;
            if (!parentQuestionId) {
                router.push('/');
                return;
            }

            // Update current question
            Api.get(`/question/${parentQuestionId}`).then((res) => {
                const { question } = res.data as { question: Question };
                updateQuestion(question);
                setProcessingQuestion(undefined);
            }).catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    return (
        <div className={globalStyles.page}>
            <div className={globalStyles.panelPage}>
                <QuestionLeftMenu
                    rootQuestion={rootQuestion}
                    question={question}
                    processingQuestion={processingQuestion}
                    sources={sources}
                    suggestions={suggestions}
                    onSourceAdded={(source: Source) => {
                        setSources([...sources || [], source]);
                    }}
                    onSourceDeleted={(source: Source) => {
                        setSources((sources || []).filter((s) => s.id !== source.id));
                    }}
                    onChangeQuestion={updateQuestion}
                    onClickAddQuestion={(question: Question): void => {
                        setAddQuestion(question);
                        setShowAddQuestionModal(true);
                    }}
                    onClickDeleteQuestion={onDeleteQuestion}
                />
                <AnswerView
                    rootQuestion={rootQuestion}
                    question={question}
                />
            </div>
            <AddQuestionModal
                open={showAddQuestionModal}
                onClose={(): void => { setShowAddQuestionModal(false); }}
                rootQuestion={rootQuestion}
                addQuestion={addQuestion}
                onAddQuestion={(question: Question) => {
                    setShowAddQuestionModal(false);
                    updateQuestion(question);
                }}
            />
        </div>
    );
}
