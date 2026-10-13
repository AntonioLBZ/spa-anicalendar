'use client';

import { useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 8;

/** Hides the header while scrolling down and reports whether the page is scrolled at all (for its shadow). */
const useAutoHideHeader = (headerRef: React.RefObject<HTMLElement | null>) => {
    const [isHidden, setIsHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        lastScrollY.current = window.scrollY;

        const update = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 0);
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

        // Pages restored mid-scroll start with the shadow
        const initialFrame = requestAnimationFrame(update);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(initialFrame);
            window.removeEventListener('scroll', onScroll);
        };
    }, [headerRef]);

    return { isHidden, isScrolled };
};

export { useAutoHideHeader };
