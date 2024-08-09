/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import Text from '../text/text';
import Tooltip from '../tooltip/tooltip';
import { useUserContext } from "../../../lib/context/UserContext";
import { useOutsideClick } from '../../hooks/useOutsideClick';
import ClassNameSingleton from '../../../utils/className';
import styles from './navbar.module.css'
import { match } from 'assert';

interface NavBarProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function NavBar({
    className,
    style
}: NavBarProps) {
    const router = useRouter();
    const { user, logout } = useUserContext();

    const goHome = () => {
        if (window.location.pathname === '/') {
            window.location.reload();
            return;
        }

        router.push('/');
    }

    const handleProfileMenuOption = (menuOption: string) => {
        switch (menuOption.toLocaleLowerCase()) {
        case 'logout':
            logout();
            break;
        case 'subscription':
            router.push('/subscription');
            break;
        }
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.left}>
                <NavBarIcon label="My Questions" labelPosition="left" onClick={goHome}>
                    <img className={styles.questionIcon} src="/icons/question.png" alt="My Questions" />
                </NavBarIcon>
            </div>
            <div className={styles.center}></div>
            <div className={styles.right}>
                {/* <NavBarIcon label="My Answers" labelPosition="right">
                    <img className={styles.answersIcon} src="/icons/nodes.png" alt="My Answers" />
                </NavBarIcon> */}
                <NavBarIcon
                    label="Profile" 
                    labelPosition="right" 
                    menuOptions={["Logout"]}
                    onClickMenuOption={handleProfileMenuOption}
                >
                    <div className={styles.profileIcon}>
                        <Text
                            className={styles.profileIconText}
                            text={user?.name.charAt(0) || ''} 
                        />
                    </div>
                </NavBarIcon>
            </div>
        </div>
    )
}

interface NavBarIconProps {
    children: React.ReactNode;
    label?: string;
    menuOptions?: Array<string>;
    onClick?: () => void;
    onClickMenuOption?: (menuOption: string) => void;
    labelPosition?: 'left' | 'right';
}

function NavBarIcon({
    children,
    label,
    onClick,
    menuOptions,
    onClickMenuOption,
    labelPosition
}: NavBarIconProps) {
    const ref = useOutsideClick(() => {
        setShowLabel(false);
        setShowMenuOptions(false);
    });
    const [showLabel, setShowLabel] = React.useState(false);
    const [showMenuOptions, setShowMenuOptions] = React.useState(false);

    return (
        <div
            ref={ref}
            className={styles.navBarIconContainer}
            style={{
                ...showMenuOptions ? {
                    backgroundColor: '#1D3557'
                } : {}
            }}
            onClick={() => {
                if (menuOptions) {
                    setShowLabel(false);
                    setShowMenuOptions(!showMenuOptions);
                    return;
                }

                onClick && onClick();
            }}
            onMouseEnter={() => !showMenuOptions && setShowLabel(true)}
            onMouseLeave={() => !showMenuOptions && setShowLabel(false)}
        >
            {children}
            {(showLabel && label) && (
                <Tooltip
                    labels={[label]}
                    bottom
                    alignLeft={labelPosition === 'left'}
                    alignRight={labelPosition === 'right'}
                />
            )}
            {(showMenuOptions && menuOptions && menuOptions.length > 0) && (
                <Tooltip
                    labels={menuOptions}
                    bottom
                    alignLeft={labelPosition === 'left'}
                    alignRight={labelPosition === 'right'}
                    onClick={(menuOption: string) => onClickMenuOption && onClickMenuOption(menuOption)}
                />
            )}
        </div>
    )
}