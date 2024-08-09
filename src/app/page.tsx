/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';

import Api from '@/lib/api';
import Route from '@/lib/route';

import Text from "./components/text/text";
import Input from "./components/input/input";
import AnimatedDiv from './components/animated/animatedDiv/animatedDiv';
import QuestionTreeView from './components/views/questionTreeView/questionTreeView';
import StaticQuestionTreeView from './components/views/staticQuestionTreeView/staticQuestionTreeView';
import AddQuestionModal from './components/modal/addQuestionModal/addQuestionModal';

import ClassNameSingleton from '@/utils/className';
import { Question } from '@/utils/types';
import { isValidQuestion } from '@/utils/helpers';

import styles from "./page.module.css";
import globalStyles from "./globals.module.css";

export default function Home() {
    const router = useRouter();
    const [questionSuggestions, setQuestionSuggestions] = useState<Array<string>>([]);
    const [showQuestionSuggestions, setShowQuestionSuggestions] = useState<boolean>(false);
    const [rootQuestions, setRootQuestions] = useState<Array<Question>>([]);
    const [processingQuestion, setProcessingQuestion] = useState<Question | undefined>(undefined);
    const [questionText, setQuestionText] = useState<string>('');
    const [initialThought, setInitialThought] = useState<string>('');
    const [step, setStep] = useState<number>(0);
    const [addQuestion, setAddQuestion] = useState<Question | undefined>(undefined);
    const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);
    const effectRan = useRef(false);

    useEffect((): any => {
        if (!effectRan.current) {
            updateRootQuestions();
        }

        return () => effectRan.current = true;
    }, []);

    useEffect(() => {
        setShowAddQuestionModal(true);
    }, [addQuestion]);

    const updateRootQuestions = (): void => {
        Api.get('/question/roots').then((res) => {
            const { questions } = res.data as { questions: Array<Question> };
            setRootQuestions(questions);

            if (questions.length <= 0) {
                getSuggestions();
            }
        }).catch((err) => {
            console.error(err);
        });
    }
    
    const getSuggestions = (): void => {
        Api.get('/question/suggestions').then((res) => {
            const { questions } = res.data as { questions: Array<string> };
            setQuestionSuggestions(questions);
        }).catch((err) => {
            console.error(err);
        });
    }

    const onSubQuestionSelected = (subQuestionText: string): void => {
        Api.post('/question', {
            question_text: questionText,
            initial_thought: initialThought
        }).then((res) => {
            const { question } = res.data as { question: Question };
            if (subQuestionText === question.question_text) {
                router.push(Route.getQuestionRoute(question));
                return;
            }

            Api.post('/question', {
                question_text: subQuestionText,
                parent_question_id: question.id
            }).then((res) => {
                const { question } = res.data as { question: Question };
                router.push(Route.getQuestionRoute(question));
            }).catch((err) => {
                console.error(err);
                // todo: handle error
            });
        }).catch((err) => {
            console.error(err);
            // todo: handle error
        });
    }

    const getRootQuestion = (question: Question): Question | null => {
        const stack = rootQuestions.map((q) => {
            return {
                question: q,
                rootQuestion: q,
            }
        });

        while (stack.length > 0) {
            const node = stack.pop();
            if (node && node.question) {
                if (node.question.id === question.id) {
                    return node.rootQuestion;
                }

                stack.push(...node.question.children.map((q) => {
                    return {
                        question: q,
                        rootQuestion: node.rootQuestion
                    }
                }));
            }
        }

        return null;
    }

    return (
        <div className={globalStyles.page}>
            {step === 0 && (
                <div>
                    <AnimatedDiv className={styles.questionContainer}>
                        <Text
                            className={styles.questionHeader}
                            text="What's a question you want to deep-dive on?" 
                            h2
                        />
                        <Input
                            className={styles.questionInput}
                            value={questionText}
                            onChange={setQuestionText}
                            includeSubmitBtn
                            onSubmit={(): void => {
                                setStep(step + 1);
                            }}
                            submitDisabled={!isValidQuestion(questionText)}
                            placeholder={'e.g. What is the meaning of life?'}
                            autofocus
                        />
                        {questionSuggestions.length > 0 && (
                            <>
                                <AnimatedDiv
                                    className={styles.showQuestionSuggestionsTextContainer}
                                    onClick={(): void => { setShowQuestionSuggestions(!showQuestionSuggestions); }}
                                >
                                    <Text
                                        className={styles.showQuestionSuggestionsText}
                                        text={showQuestionSuggestions ? 'Hide suggestions' : 'Show suggestions'}
                                    />
                                    <img
                                        className={ClassNameSingleton.combine([
                                            styles.showQuestionSuggestionsArrow,
                                            showQuestionSuggestions ? styles.showQuestionSuggestionsArrowSelected : ''
                                        ])}
                                        src="/icons/down-gray.png" 
                                        alt="expand" 
                                    />
                                </AnimatedDiv>
                                {showQuestionSuggestions && (
                                    <AnimatedDiv className={styles.questionSuggestionsContainer}>
                                        {questionSuggestions.map((question) => (
                                            <Text
                                                key={question}
                                                className={styles.questionSuggestion}
                                                text={question}
                                                onClick={(): void => {
                                                    setQuestionText(question);
                                                    setStep(step + 1);
                                                }}
                                            />
                                        ))}
                                    </AnimatedDiv>
                                )}
                            </>
                        )}
                    </AnimatedDiv>
                    {rootQuestions.length > 0 && (
                        <AnimatedDiv className={styles.existingQuestionsOuterContainer}>
                            <Text
                                className={styles.existingQuestionsHeader}
                                text="Or jump right back in..."
                                h2
                            />
                            <div className={styles.existingQuestionsContainer}>
                                {rootQuestions.map((rootQuestion) => (
                                    <StaticQuestionTreeView
                                        key={rootQuestion.id}
                                        rootQuestion={rootQuestion}
                                        selectedQuestion={undefined}
                                        processingQuestion={processingQuestion}
                                        onSelectQuestion={(question: Question) => {
                                            router.push(Route.getQuestionRoute(question));
                                        }}
                                        onClickAddQuestion={(question: Question) => {
                                            setAddQuestion(question);
                                        }}
                                        onClickDeleteQuestion={(question: Question) => {
                                            setProcessingQuestion(question);
                                            Api.delete(`/question/${question.id}`).then(() => {
                                                updateRootQuestions();
                                            }).catch((err) => {
                                                console.log(err);
                                            });
                                        }}
                                        hoverBackgroundColor='#e7eae6'
                                    />
                                ))}
                            </div>
                        </AnimatedDiv>
                    )}
                </div>
            )}
            {step === 1 && (
                <AnimatedDiv className={styles.questionContainer}>
                    <Text 
                        className={styles.submittedQuestion} 
                        text={questionText} 
                        italic
                        onClick={(): void => { setStep(step - 1); }}
                    />
                    <Text
                        className={styles.questionHeader}
                        text="What's your first thought?" 
                        h2
                    />
                    <Text
                        className={styles.questionSubheader}
                        text="It's okay to be wrong. It's the process that matters."
                    />
                    <Input
                        className={styles.questionInput}
                        value={initialThought}
                        onChange={setInitialThought}
                        includeSubmitBtn
                        onSubmit={(): void => {
                            setStep(step + 1);
                        }}
                        placeholder='...'
                        autofocus
                    />
                </AnimatedDiv>
            )}
            {step === 2 && (
                <AnimatedDiv className={styles.questionDeepDiveContainer}>
                    <Text
                        className={styles.questionDeepDiveHeader}
                        text={"Start small to answer your big question"}
                        h1
                    />
                    <Text
                        className={styles.questionDeepDiveSubHeader}
                        text="We’ve broken down your question into smaller questions that are easier to answer. We recommend starting with focused questions and gradually expanding your foundational knowledge to answer the main question. You can also select the main question if you feel comfortable answering directly."
                    />
                    <Text
                        className={styles.questionDeepDiveSubHeader}
                        text="Select the question you're most interested in exploring first or input one of your own:"
                        bold
                    />
                    <div className={styles.questionTreeContainer}>
                        <QuestionTreeView
                            newQuestionText={questionText}
                            onSelectQuestion={onSubQuestionSelected}
                        />
                    </div>
                </AnimatedDiv>
            )}
            {(showAddQuestionModal && addQuestion) && (
                <AddQuestionModal
                    open={showAddQuestionModal}
                    onClose={(): void => { setShowAddQuestionModal(false); }}
                    rootQuestion={getRootQuestion(addQuestion) as Question}
                    addQuestion={addQuestion}
                    onAddQuestion={(question: Question) => {
                        router.push(Route.getQuestionRoute(question));
                    }}
                />
            )}
        </div>
    );
}
