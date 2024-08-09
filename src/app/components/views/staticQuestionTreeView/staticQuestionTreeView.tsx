/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useEffect } from 'react';

import Text from "@/app/components/text/text";
import AnimatedDiv from '@/app/components/animated/animatedDiv/animatedDiv';
import AddButton from '../../buttons/addButton/addButton';
import Tooltip from '../../tooltip/tooltip';
import Loading from '../../animated/loading/loading';

import { useOutsideClick } from '@/app/hooks/useOutsideClick';
import { Question } from '@/utils/types';
import ClassNameSingleton from '@/utils/className';
import styles from "./staticQuestionTreeView.module.css";

const MAX_ADD_QUESTION_DEPTH = 3;

interface StaticQuestionTreeViewProps {
    selectedQuestion?: Question;
    rootQuestion?: Question;
    processingQuestion?: Question;
    onSelectQuestion: (question: Question) => void;
    onClickDeleteQuestion: (question: Question) => void;
    onClickAddQuestion: (question: Question) => void;
    hoverBackgroundColor?: string;
}

interface StaticQuestionTreeNode {
    question: Question;
    children: Array<StaticQuestionTreeNode>;
    showChildren: boolean;
    depth: number;
    showTooltip: boolean;
    hovered: boolean;
}

export default function StaticQuestionTreeView({
    selectedQuestion,
    rootQuestion,
    processingQuestion,
    onSelectQuestion,
    onClickDeleteQuestion,
    onClickAddQuestion,
    hoverBackgroundColor
}: StaticQuestionTreeViewProps) {
    const [tree, setTree] = useState<StaticQuestionTreeNode | undefined>(undefined);

    useEffect(() => {
        if (!rootQuestion) return;

        const constructTree = (node: Question, depth: number): StaticQuestionTreeNode => {
            return {
                question: node,
                children: node.children.map((child: Question)  => constructTree(child, depth + 1)),
                showChildren: node.id === rootQuestion.id ? true : false,
                depth,
                showTooltip: false,
                hovered: false
            };
        }

        const newTree = constructTree(rootQuestion, 0);

        // Expand the tree to the selected question
        const expandToSelected = (node: StaticQuestionTreeNode): boolean => {
            if (node.question.id === selectedQuestion?.id) {
                node.showChildren = true;
                return true;
            }

            for (let child of node.children) {
                if (expandToSelected(child)) {
                    node.showChildren = true;
                    return true;
                }
            }

            return false;
        }

        expandToSelected(newTree);
        setTree(newTree);
    }, [rootQuestion, selectedQuestion]);

    const ref = useOutsideClick(() => {
        if (!tree) return;
        const stack = [tree];
        while (stack.length > 0) {
            const node = stack.pop();
            if (node) {
                node.showTooltip = false;
                node.hovered = false;
                stack.push(...node.children);
            }
        }
        
        setTree({...tree});
    });

    const renderTree = (node: StaticQuestionTreeNode, depth: number) => {
        const isRootNode = node.question.id === rootQuestion?.id;
        const isSelectedNode = node.question.id === selectedQuestion?.id;
        const showBackground = isSelectedNode || node.hovered || node.showTooltip;
        
        return (
            <AnimatedDiv
                key={`question-${node.question.id}`} 
                className={styles.questionContainer}
            >
                <div
                    ref={ref}
                    className={ClassNameSingleton.combine([
                        styles.questionHeaderContainer,
                        showBackground ? styles.questionHeaderContainerHovered : '',
                    ])}
                    onMouseEnter={() => {
                        if (!tree) return;
                        node.hovered = true;
                        setTree({...tree});
                    }}
                    onMouseLeave={() => {
                        if (!tree) return;
                        node.hovered = false;
                        setTree({...tree});
                    }}
                    style={{
                        ...(node.children.length <= 0 && !isRootNode) ? { 
                            marginLeft: 15 
                        } : {},
                        ...(showBackground && hoverBackgroundColor) ? {
                            backgroundColor: hoverBackgroundColor
                        } : {}
                    }}
                >
                    {node.children.length > 0 && (
                        <img
                            className={ClassNameSingleton.combine([
                                styles.questionExpandIcon,
                                node.showChildren ? styles.questionExpandIconSelected : ''
                            ])} 
                            src="/icons/down.png" 
                            alt="Expand"
                            onClick={(): void => {
                                if (!tree) return;
                                node.showChildren = !node.showChildren;
                                setTree({...tree});
                            }}
                        />
                    )}
                    <Text
                        className={ClassNameSingleton.combine([
                            styles.questionText,
                            isRootNode ? styles.rootQuestionText : '',
                            isSelectedNode ? styles.selectedQuestionText : '',
                        ])}
                        text={node.question.question_text}
                        semibold={isRootNode}
                        bold={isSelectedNode}
                        onClick={() => {
                            onSelectQuestion(node.question)
                        }}
                    />
                    <div className={styles.actionContainer}>
                        <div 
                            className={styles.moreIconContainer}
                            onClick={(): void => {
                                if (!tree) return;
                                node.showTooltip = !node.showTooltip;
                                setTree({...tree});
                            }}
                        >
                            <img
                                className={styles.moreIcon}
                                src="/icons/more.png"
                                alt="More"
                            />
                        </div>
                        {depth < MAX_ADD_QUESTION_DEPTH && (
                            <AddButton 
                                className={styles.addButton}
                                onClick={(): void => { onClickAddQuestion(node.question) }} 
                            />
                        )}
                        {node.showTooltip && (
                            node.question.id === processingQuestion?.id ? (
                                <div className={styles.loadingContainer}>
                                    <Loading />
                                </div>
                            ) : (
                                <Tooltip
                                    labels={['Delete']}
                                    bottom
                                    alignLeft
                                    onClick={(label: string) => {
                                        if (label === 'Delete') {
                                            onClickDeleteQuestion(node.question);
                                            return;
                                        }
                                    }}
                                />
                            )
                        )}
                    </div>
                </div>
                {node.showChildren && node.children.map((child) => renderTree(child, depth + 1))}
            </AnimatedDiv>
        );
    }

    return (
        <div className={styles.container}>
            {tree && (
                renderTree(tree, 0)
            )}
        </div>
    );
}