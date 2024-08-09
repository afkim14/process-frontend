"use client"
import React, { createContext, useState } from 'react';
import ClassNameSingleton from '@/utils/className';
import Text from '@/app/components/text/text';
import styles from './PopupContext.module.css';

interface Popup {
    id: number;
    text: string;
    type: 'success' | 'error' | 'warning';
}

interface PopupContextType {
    showPopup: ({ text, type }: { text: string; type: 'success' | 'error' | 'warning'; }) => void;
}

const PopupContext = createContext<PopupContextType>(null as unknown as PopupContextType);
export const usePopupContext = () => React.useContext(PopupContext)

export const PopupProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [popups, setPopups] = useState<Array<Popup>>([]);

    const showPopup = ({ text, type }: { text: string; type: 'success' | 'error' | 'warning'; }) => {
        const popup = { id: Date.now(), text, type };
        setPopups([...popups, popup]);
        setTimeout(() => setPopups([...popups.filter((p) => p.id !== popup.id)]), 3000);
    }

    return (
        <PopupContext.Provider value={{ showPopup }}>
            {children}
            <div className={styles.popupsContainer}>
                {popups.map((popup, idx) => (
                    <div
                        key={`popup-${popup.id}`}
                        className={ClassNameSingleton.combine([
                            styles.popup,
                            styles[popup.type],
                        ])}
                    >
                        <Text className={styles.popupText} text={popup.text} />
                    </div>
                ))}
            </div>
        </PopupContext.Provider>
    );
};