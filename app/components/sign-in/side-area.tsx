"use client";

import { Moon, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export const SideArea = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const spheres = gsap.utils.toArray<HTMLDivElement>(".floating-sphere");

            gsap.from(spheres, {
                opacity: 0, scale: 0.4, duration: 2.5,
                ease: "expo.out", stagger: 0.18,
            });

            gsap.from(".side-headline", {
                y: 40, opacity: 0, duration: 1.4,
                ease: "expo.out", delay: 0.4,
            });

            // Chaotic continuous movement with random waypoints
            const animateSphere = (sphere: HTMLDivElement, i: number) => {
                const createWaypoint = () => ({
                    x: gsap.utils.random(-150, 150),
                    y: gsap.utils.random(-150, 150),
                    scale: gsap.utils.random(0.7, 1.4),
                    rotation: gsap.utils.random(-180, 180),
                });

                // Start from random position
                const startPos = createWaypoint();
                gsap.set(sphere, startPos);

                // Create a timeline with infinite random waypoints
                const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
                
                for (let j = 0; j < 6; j++) {
                    const waypoint = createWaypoint();
                    tl.to(sphere, {
                        x: waypoint.x,
                        y: waypoint.y,
                        scale: waypoint.scale,
                        rotation: waypoint.rotation,
                        duration: gsap.utils.random(2, 5),
                        ease: gsap.utils.random(["power1.inOut", "elastic.out(1, 0.5)", "back.inOut"]),
                        delay: j === 0 ? i * 0.2 : 0,
                    }, "+=0.5");
                }
            };

            spheres.forEach((sphere, i) => {
                animateSphere(sphere as HTMLDivElement, i);
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className='hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 overflow-hidden'
        >
            <div className='absolute inset-0'>
                <div className='floating-sphere absolute top-[10%] left-[5%] w-72 h-72 rounded-full'
                    style={{ background: "radial-gradient(circle at 40% 35%, rgba(244,114,182,0.55), rgba(219,39,119,0.2) 60%, transparent 80%)", filter: "blur(48px)" }} />
                <div className='floating-sphere absolute top-[25%] right-[5%] w-96 h-96 rounded-full'
                    style={{ background: "radial-gradient(circle at 40% 35%, rgba(34,211,238,0.4), rgba(6,182,212,0.15) 60%, transparent 80%)", filter: "blur(48px)" }} />
                <div className='floating-sphere absolute bottom-[15%] left-[15%] w-80 h-80 rounded-full'
                    style={{ background: "radial-gradient(circle at 40% 35%, rgba(251,191,36,0.4), rgba(245,158,11,0.15) 60%, transparent 80%)", filter: "blur(48px)" }} />
                <div className='floating-sphere absolute top-[45%] left-[35%] w-64 h-64 rounded-full'
                    style={{ background: "radial-gradient(circle at 40% 35%, rgba(52,211,153,0.45), rgba(16,185,129,0.15) 60%, transparent 80%)", filter: "blur(48px)" }} />
                <div className='floating-sphere absolute bottom-[10%] right-[10%] w-72 h-72 rounded-full'
                    style={{ background: "radial-gradient(circle at 40% 35%, rgba(129,140,248,0.45), rgba(99,102,241,0.15) 60%, transparent 80%)", filter: "blur(48px)" }} />
            </div>

            <div className='absolute inset-0 opacity-5'
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

            <div className='relative w-full flex flex-col justify-between p-12 text-white z-10'>
                <div className='flex items-center gap-2'>
                    <div className='p-2 bg-white/10 rounded-xl backdrop-blur-sm'>
                        <Moon className='w-6 h-6' />
                    </div>
                    <span className='text-xl font-light tracking-wider'>
                        CHILL<span className='font-bold'>ZONE</span>
                    </span>
                </div>

                <div className='flex-1 flex flex-col justify-center'>
                    <h1 className='side-headline text-7xl font-bold leading-tight mb-6'>
                        ДОБРО<br />
                        <span className='text-purple-200'>ПОЖАЛОВАТЬ</span>
                    </h1>
                    <p className='text-purple-200 text-lg max-w-md leading-relaxed'>
                        Общайтесь с другими любителями отдыха, делитесь впечатлениями и наслаждайтесь искусством ничегонеделания в компании.
                    </p>
                </div>

                <div className='flex items-center gap-2 text-purple-200 text-sm'>
                    <Sparkles className='w-4 h-4' />
                    <span>Наконец-то место, где не надо притворяться занятым.</span>
                </div>
            </div>
        </div>
    );
};