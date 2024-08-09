"use client"
import React, { createContext, useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Api from '../api';
import { User } from '../../utils/types'

const ROUTES_WITHOUT_AUTH = ['/about'];

interface UserContextType {
  user: User | null | undefined;
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>(null as unknown as UserContextType);
export const useUserContext = () => React.useContext(UserContext)

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const prevPathname = usePrevious(pathname);
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const effectRan = useRef(false);

    useEffect(() => {
        if (!prevPathname || !pathname) return;

        if (ROUTES_WITHOUT_AUTH.includes(prevPathname) && !ROUTES_WITHOUT_AUTH.includes(pathname)) {
            getMe();
        }
    }, [prevPathname, pathname])

    const getMe = () => {
        Api.get('/user/me').then((res) => {
            const userData: User = res.data as User;
            setUser(userData);
        }).catch((err) => {
            console.log(err);
            setUser(null);
            if (pathname !== '/login') {
                router.push('/login');
            }
        })
    };

    const login = () => {
        window.location.href = `${Api.baseURL}/login/google`;
    };

    const logout = () => {
        document.cookie = 'process-jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    useEffect((): any => {
        if (!effectRan.current) {
            if (ROUTES_WITHOUT_AUTH.includes(pathname)) {
                setUser(null);
                return;
            }

            getMe();
        }

        return () => effectRan.current = true;
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {pathname && ROUTES_WITHOUT_AUTH.includes(pathname) ? (
                children
            ) : (
                (user === undefined || (user === null && pathname !== '/login'))
                    ? null
                    : children
            )}
        </UserContext.Provider>
    );
};

function usePrevious(value: any): any {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}