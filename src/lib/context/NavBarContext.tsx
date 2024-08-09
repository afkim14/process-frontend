"use client"
import React, { createContext, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NavBar from '@/app/components/navbar/navbar';

const ROUTES_WITHOUT_NAVBAR = ['/about', '/login', '/onboarding'];

interface NavBarContextType {
    showNavBar: boolean;
    setShowNavBar: (show: boolean) => void;
}

const NavBarContext = createContext<NavBarContextType>(null as unknown as NavBarContextType);
export const useNavBarContext = () => React.useContext(NavBarContext)

export const NavBarProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const pathname = usePathname();
    const prevPathname = usePrevious(pathname);
    const [showNavBar, setShowNavBar] = useState<boolean>(false);

    useEffect(() => {
        if (!ROUTES_WITHOUT_NAVBAR.includes(pathname)) {
            setShowNavBar(true);
        }
    }, [])

    useEffect(() => {
        if (!prevPathname || !pathname) return;

        if (ROUTES_WITHOUT_NAVBAR.includes(prevPathname) && !ROUTES_WITHOUT_NAVBAR.includes(pathname)) {
            setShowNavBar(true);
        } else if (!ROUTES_WITHOUT_NAVBAR.includes(prevPathname) && ROUTES_WITHOUT_NAVBAR.includes(pathname)) {
            setShowNavBar(false);
        }
    }, [prevPathname, pathname])

    return (
        <NavBarContext.Provider value={{ showNavBar, setShowNavBar }}>
            {showNavBar && <NavBar />}
            {children}
        </NavBarContext.Provider>
    );
};

function usePrevious(value: any): any {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}