'use client';

import { useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 8;

const useAutoHideHeader = (headerRef: React.RefObject<HTMLElement | null>): boolean => {
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        lastScrollY.current = window.scrollY;

        const update = () => {
            const scrollY = window.scrollY;
            const diff = scrollY - lastScrollY.current;
            const headerHeight = headerRef.current?.offsetHeight ?? 0;

            if (scrollY <= headerHeight) {
                setIsHidden(false);
            } else if (Math.abs(diff) >= SCROLL_THRESHOLD) {
                setIsHidden(diff > 0);
            }

            lastScrollY.current = scrollY;
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                ticking.current = true;
                requestAnimationFrame(update);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [headerRef]);

    return isHidden;
};

export { useAutoHideHeader };
