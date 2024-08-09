"use client"
import { useEffect } from 'react'

interface LoadingProps {
    size?: number;
    color?: string;
    stroke?: number;
    speed?: number;
}

export default function Loading({
    size,
    color,
    stroke,
    speed
}: LoadingProps) {
    useEffect(() => {
        async function getLoader() {
            const { ring2 } = await import('ldrs')
            ring2.register()
        }

        getLoader()
    }, [])

    return (
        <l-ring-2
            size={size || 15}
            stroke={stroke || "2"}
            stroke-length="0.25"
            bg-opacity="0.1"
            speed={speed || "0.8" } 
            color={color || "#1D3557"} 
        ></l-ring-2>
    );
}