import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@/lib/context/UserContext";
import { NavBarProvider } from "@/lib/context/NavBarContext";
import { PopupProvider } from "@/lib/context/PopupContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Process",
    description: "Deep-dive into ideas to achieve understanding.",
    icons: {
        icon: '/favicon.ico',
    },
    openGraph: {
        title: "Process",
        description: "Deep-dive into ideas to achieve understanding.",
    // images: [
    //   {
    //     url: 'https://wedding-website-48b5e.web.app/pictures/story/engagement.png',
    //     width: 800,
    //     height: 600,
    //   }
    // ]
    },
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
            </head>
            <body className={inter.className}>
                <UserProvider>
                    <NavBarProvider>
                        <PopupProvider>
                            {children}
                        </PopupProvider>
                    </NavBarProvider>
                </UserProvider>
            </body>
        </html>
    );
}
