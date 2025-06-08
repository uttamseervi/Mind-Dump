'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
    onIntersect?: () => void;
}

export function useIntersectionObserver({
    threshold = 0,
    root = null,
    rootMargin = '0px',
    onIntersect,
}: UseIntersectionObserverProps = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                if (entry.isIntersecting && onIntersect) {
                    onIntersect();
                }
            },
            {
                threshold,
                root,
                rootMargin,
            }
        );

        const currentTarget = targetRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [threshold, root, rootMargin, onIntersect]);

    return { targetRef, isIntersecting };
} 