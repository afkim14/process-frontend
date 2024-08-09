/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import moment, { Moment } from 'moment';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { usePopupContext } from '@/lib/context/PopupContext';
import { useDebounce } from "use-debounce";
import { useOutsideClick } from '@/app/hooks/useOutsideClick';
import Tooltip from '../tooltip/tooltip';
import Loading from '../animated/loading/loading';
import ClassNameSingleton from '@/utils/className';
import Text from '../text/text';
import {
    Editor, 
    EditorState, 
    RichUtils, 
    DraftComponent,
    ContentState,
    convertToRaw,
    convertFromRaw
} from 'draft-js';

import Api from '@/lib/api';

import 'draft-js/dist/Draft.css';
import './texteditor.css'
import styles from './texteditor.module.css'
import { Question } from '@/utils/types';

interface TextEditorProps {
    rootQuestion: Question;
    question: Question;
    onQuestionUpdate?: (question: Question) => void;
    placeholder?: string;
    autosave?: boolean;
}

const AUTOSAVE_INTERVAL = 5000;

export default function TextEditor({
    rootQuestion,
    question,
    placeholder,
    autosave,
}: TextEditorProps) {
    const [lastSaved, setLastSaved] = useState<{
        answer: string;
        lastSavedAt: Moment | undefined;
    }>({
        answer: question.answer_text,
        lastSavedAt: undefined
    });
    const editorRef = useRef(null);
    const [editorState, setEditorState] = useState<EditorState | undefined>(undefined);
    const prevQuestion = usePrevious(question);
    const prevEditorState = usePrevious(editorState);
    const [debouncedEditorState] = useDebounce(editorState, AUTOSAVE_INTERVAL);
    const [generateToolDisabled, setGenerateToolDisabled] = useState<boolean>(false);
    const [showGenerateTooltip, setShowGenerateTooltip] = useState<boolean>(false);
    const { showPopup } = usePopupContext();

    useEffect(() => {
        // Logic to run on first load
        const lastKnownLocalAnswer = window.sessionStorage.getItem(`question-${question.id}-last-known`);
        const lastKnownStorageAnswer = localStorage.getItem(`question-${question.id}-last-known`);
        setEditorState(EditorState.createWithContent(
            convertFromRaw(markdownToDraft(lastKnownLocalAnswer || lastKnownStorageAnswer || question.answer_text))
        ));
    }, []);

    useEffect(() => {
        // Custom logic to run before refresh
        const handleBeforeUnload = (event: any) => {
            if (!editorState) return;
            if (question.answer_text === contentStateToMarkdown(editorState.getCurrentContent())) return;

            localStorage.setItem(
                `question-${question.id}-last-known`, 
                contentStateToMarkdown(editorState.getCurrentContent())
            );
            onAutoSave(question, editorState.getCurrentContent());
            event.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [editorState])

    // Update when question changes
    useEffect(() => {
        // Question changed
        if (prevQuestion && prevQuestion.id !== question.id) {
            onAutoSave(prevQuestion, prevEditorState.getCurrentContent());
        }

        // Update current states after question changed
        setLastSaved({
            answer: question.answer_text,
            lastSavedAt: undefined
        });

        const lastKnownLocalAnswer = window.sessionStorage.getItem(`question-${question.id}-last-known`);
        const lastKnownStorageAnswer = localStorage.getItem(`question-${question.id}-last-known`);
        setEditorState(EditorState.createWithContent(
            convertFromRaw(markdownToDraft(lastKnownLocalAnswer || lastKnownStorageAnswer || question.answer_text))
        ));
    }, [question]);

    // Every time autosave interval is reached
    useEffect(() => {
        if (!autosave || !editorState || generateToolDisabled) return;
        onAutoSave(question, editorState.getCurrentContent());
    }, [debouncedEditorState, generateToolDisabled]);

    const contentStateToMarkdown = (contentState: ContentState): string => {
        const rawContentState = convertToRaw(contentState);
        return draftToMarkdown(rawContentState);
    }

    const onAutoSave = useCallback((question: Question, contentState: ContentState) => {
        const markdown = contentStateToMarkdown(contentState);
        if (lastSaved && lastSaved.answer === markdown) return;

        // Save locally
        window.sessionStorage.setItem(
            `question-${question.id}-last-known`,
            contentStateToMarkdown(contentState)
        );

        // Save in backend
        Api.put(`/question/${question.id}`, {
            answer_text: markdown
        }).then(() => {
            setLastSaved({
                answer: markdown,
                lastSavedAt: moment()
            });
        }).catch((err) => {
            console.log(err);
        });
    }, [question, lastSaved]);

    const handleKeyCommand = (command: DraftComponent.Base.EditorCommand, editorState: EditorState, eventTimeStamp: number) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
    
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
    
        return 'not-handled';
    }

    const getCurrentBlockType = () => {
        if (!editorState) return;
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const block = contentState.getBlockForKey(selectionState.getStartKey());
        return block.getType();
    }

    const onBoldClick = () => {
        if (!editorState) return;
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    }

    const onItalicClick = () => {
        if (!editorState) return;
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    }

    const onUnderlineClick = () => {
        if (!editorState) return;
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    }

    const onBulletPointClick = () => {
        if (!editorState) return;
        setEditorState(RichUtils.toggleBlockType(editorState, 'unordered-list-item'));
    }
    
    const onGenerate = () => {
        if (!editorState) return;

        Api.post(`/question/generate-answer`, {
            main_question_text: rootQuestion.question_text,
            subquestion_text: question.question_text,
        }).then((res) => {
            const { answer_text } = res.data as { answer_text: string };
            try {
                setEditorState(EditorState.push(
                    editorState,
                    convertFromRaw(markdownToDraft(answer_text)),
                    'insert-characters'
                ));
                setGenerateToolDisabled(false);
            } catch (e) {
                console.log(e);
                setGenerateToolDisabled(false);
            }
        }).catch((err) => {
            console.log(err);
            setGenerateToolDisabled(false);
        });
    }

    const onShare = () => {
        if (!editorState) return;
        navigator.clipboard.writeText(contentStateToMarkdown(editorState.getCurrentContent()));
        showPopup({ text: 'Copied!', type: 'success' });
    }

    const ref = useOutsideClick(() => {
        setShowGenerateTooltip(false);
    });

    if (!editorState) return null;

    return (
        <div>
            <div className={styles.toolbar} ref={ref}>
                <ToolbarButton
                    label="Bold" 
                    selected={editorState.getCurrentInlineStyle().has('BOLD')} 
                    onClick={onBoldClick}
                >
                    <Text className={ClassNameSingleton.combine([styles.toolbarBtnText, styles.boldButton])} text="B" />
                </ToolbarButton>
                <ToolbarButton
                    label="Italic" 
                    selected={editorState.getCurrentInlineStyle().has('ITALIC')} 
                    onClick={onItalicClick}
                >
                    <Text className={ClassNameSingleton.combine([styles.toolbarBtnText, styles.italicButton])} text="I" />
                </ToolbarButton>
                <ToolbarButton
                    label="Underline" 
                    selected={editorState.getCurrentInlineStyle().has('UNDERLINE')} 
                    onClick={onUnderlineClick}
                >
                    <Text className={ClassNameSingleton.combine([styles.toolbarBtnText, styles.underlineButton])} text="U" />
                </ToolbarButton>
                <ToolbarButton
                    label="Bullet Point" 
                    selected={getCurrentBlockType() === 'unordered-list-item'} 
                    onClick={onBulletPointClick}
                >
                    <Text className={ClassNameSingleton.combine([styles.toolbarBtnText, styles.bulletpointButton])} text="•" />
                </ToolbarButton>
                <ToolbarButton
                    className={styles.generateBtn}
                    label="Generate" 
                    selected={false} 
                    onClick={(): void => {
                        if (editorState.getCurrentContent().hasText()) {
                            setShowGenerateTooltip(true);
                        } else {
                            setGenerateToolDisabled(true);
                            onGenerate();
                        }
                    }}
                    disabled={generateToolDisabled}
                >
                    {generateToolDisabled ? <Loading size={20} /> : (
                        <img className={styles.generateIcon} src="/icons/star.png" alt="Generate" />
                    )}
                    {showGenerateTooltip && (
                        <Tooltip
                            labels={['Replace existing text']}
                            bottom
                            alignLeft
                            onClick={(label: string) => {
                                if (label === 'Replace existing text') {
                                    setShowGenerateTooltip(false);
                                    setGenerateToolDisabled(true);
                                    onGenerate();
                                    return;
                                }
                            }}
                        />
                    )}
                </ToolbarButton>
                <ToolbarButton
                    label="Share" 
                    selected={false} 
                    onClick={onShare}
                >
                    <img className={styles.shareIcon} src="/icons/share.png" alt="Share" />
                </ToolbarButton>
            </div>
            <Editor
                editorState={editorState} 
                onChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                ref={editorRef}
                placeholder={placeholder || '...'}
                readOnly={generateToolDisabled}
            />
        </div>
    );
}

function ToolbarButton({
    label,
    selected,
    onClick,
    children,
    className,
    textClassName,
    disabled
}: {
    label: string;
    selected: boolean;
    onClick: (label: string) => void;
    children?: React.ReactNode;
    className?: string;
    textClassName?: string;
    disabled?: boolean;
}) {
    return (
        <div
            className={ClassNameSingleton.combine([
                styles.toolbarBtn,
                className || '',
                selected ? styles.toolbarBtnSelected : '',
                disabled ? styles.toolbarBtnDisabled : ''
            ])}
            onClick={() => !disabled && onClick(label)}
        >
            {children || (
                <Text
                    className={ClassNameSingleton.combine([
                        styles.toolbarBtnText,
                        textClassName || ''
                    ])}
                    text={label} 
                />
            )}
        </div>
    )
}

function usePrevious(value: any): any {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}