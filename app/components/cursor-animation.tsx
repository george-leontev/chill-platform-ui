"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CursorDotProps {
    delay?: number;
    size?: number;
}

export function CursorDot({ delay = 0, size = 8 }: CursorDotProps) {
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dotRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            gsap.to(dotRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3 + delay * 0.1,
                ease: "power2.out",
                delay: delay * 0.05,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [delay]);

    return (
        <div
            ref={dotRef}
            className='fixed pointer-events-none z-50 rounded-full bg-purple-600/40 blur-sm'
            style={{
                width: size,
                height: size,
                left: 0,
                top: 0,
                transform: "translate(-50%, -50%)",
            }}
        />
    );
}

interface CursorFollowerProps {
    delay?: number;
    size?: number;
}

export function CursorFollower({ delay = 0, size = 20 }: CursorFollowerProps) {
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!followerRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            gsap.to(followerRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5 + delay * 0.15,
                ease: "power3.out",
                delay: delay * 0.08,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        gsap.set(followerRef.current, {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [delay]);

    return (
        <div
            ref={followerRef}
            className='fixed pointer-events-none z-50 rounded-full bg-linear-to-r from-purple-400/30 to-pink-400/30 blur-md'
            style={{
                width: size,
                height: size,
                left: 0,
                top: 0,
                transform: "translate(-50%, -50%)",
            }}
        />
    );
}

interface RippleEffectProps {
    size?: number;
}

export function CursorRipple({ size = 30 }: RippleEffectProps) {
    const rippleRef = useRef<HTMLDivElement>(null);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!rippleRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            const distance = Math.sqrt(
                Math.pow(e.clientX - lastPositionRef.current.x, 2) + Math.pow(e.clientY - lastPositionRef.current.y, 2),
            );

            if (distance > 50) {
                lastPositionRef.current = { x: e.clientX, y: e.clientY };

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    gsap.fromTo(
                        rippleRef.current,
                        {
                            x: e.clientX,
                            y: e.clientY,
                            scale: 0,
                            opacity: 0.8,
                        },
                        {
                            scale: 2,
                            opacity: 0,
                            duration: 0.8,
                            ease: "power2.out",
                        },
                    );
                }, 50);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={rippleRef}
            className='fixed pointer-events-none z-50 rounded-full border-2 border-purple-500/50'
            style={{
                width: size,
                height: size,
                left: 0,
                top: 0,
                transform: "translate(-50%, -50%)",
            }}
        />
    );
}

interface CursorAnimationProps {
    showDots?: boolean;
    showFollower?: boolean;
    showRipple?: boolean;
}

export function CursorAnimation({ showDots = true, showFollower = true, showRipple = true }: CursorAnimationProps) {
    return (
        <>
            {showFollower && <CursorFollower delay={0} size={24} />}
            {showFollower && <CursorFollower delay={1} size={16} />}
            {showDots && <CursorDot delay={0} size={6} />}
            {showDots && <CursorDot delay={1} size={5} />}
            {showDots && <CursorDot delay={2} size={4} />}
            {showRipple && <CursorRipple size={20} />}
        </>
    );
}
