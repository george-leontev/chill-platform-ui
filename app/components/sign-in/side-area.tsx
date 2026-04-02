"use client";

import { Moon, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

export const SideArea = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const spheresRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx = gsap.context(() => {
            const spheres = spheresRef.current;

            // Initial entrance
            gsap.from(spheres, {
                opacity: 0,
                scale: 0,
                duration: 2,
                stagger: 0.2,
                ease: "elastic.out(1, 0.75)",
            });

            // Continuous floating
            spheres.forEach((sphere, i) => {
                gsap.to(sphere, {
                    y: "random(-40, 40)",
                    x: "random(-40, 40)",
                    duration: "random(3, 6)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.5,
                });
            });

            // Mouse move interaction (Parallax + Glow)
            const handleMouseMove = (e: MouseEvent) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Move glow
                gsap.to(glowRef.current, {
                    x,
                    y,
                    duration: 0.6,
                    ease: "power2.out",
                });

                // Parallax spheres
                spheres.forEach((sphere, i) => {
                    const depth = (i + 1) * 0.05;
                    const moveX = (x - rect.width / 2) * depth;
                    const moveY = (y - rect.height / 2) * depth;

                    gsap.to(sphere, {
                        x: `+=${moveX * 0.1}`,
                        y: `+=${moveY * 0.1}`,
                        duration: 1,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                });
            };

            container.addEventListener("mousemove", handleMouseMove);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.5 + i * 0.1,
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
            },
        }),
    };

    const spheres = [
        { className: 'top-[10%] left-[5%] w-72 h-72', color: 'rgba(244,114,182,0.4)' },
        { className: 'top-[25%] right-[5%] w-96 h-96', color: 'rgba(34,211,238,0.3)' },
        { className: 'bottom-[15%] left-[15%] w-80 h-80', color: 'rgba(251,191,36,0.3)' },
        { className: 'top-[45%] left-[35%] w-64 h-64', color: 'rgba(52,211,153,0.3)' },
        { className: 'bottom-[10%] right-[10%] w-72 h-72', color: 'rgba(129,140,248,0.3)' },
    ];

    return (
        <div
            ref={containerRef}
            className='hidden lg:flex lg:w-1/2 relative bg-[#0a0118] overflow-hidden'
        >
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-transparent" />
            
            {/* Interactive Glow */}
            <div 
                ref={glowRef}
                className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{ left: 0, top: 0 }}
            />

            {/* Animated Spheres */}
            <div className='absolute inset-0 pointer-events-none'>
                {spheres.map((sphere, i) => (
                    <div
                        key={i}
                        ref={el => { if (el) spheresRef.current[i] = el }}
                        className={`absolute rounded-full blur-[60px] ${sphere.className}`}
                        style={{ 
                            background: `radial-gradient(circle, ${sphere.color}, transparent 70%)`,
                        }}
                    />
                ))}
            </div>

            {/* Grain Texture */}
            <div className='absolute inset-0 opacity-[0.03] pointer-events-none'
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

            {/* Grid Pattern */}
            <div className='absolute inset-0 opacity-[0.05] pointer-events-none'
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "48px 48px" }} />

            <div className='relative w-full flex flex-col justify-between p-16 text-white z-10'>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className='flex items-center gap-3'
                >
                    <div className='p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl'>
                        <Moon className='w-6 h-6 text-purple-300' />
                    </div>
                    <span className='text-2xl font-light tracking-[0.2em]'>
                        CHILL<span className='font-black text-purple-400'>ZONE</span>
                    </span>
                </motion.div>

                <div className='flex-1 flex flex-col justify-center'>
                    <motion.h1 
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        className='text-8xl font-black leading-[0.9] mb-8 tracking-tighter'
                    >
                        ДОБРО<br />
                        <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500'>ПОЖАЛОВАТЬ</span>
                    </motion.h1>
                    
                    <motion.p 
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        className='text-purple-100/70 text-xl max-w-lg leading-relaxed font-light'
                    >
                        Забудьте о суете. Здесь мы ценим моменты спокойствия и искреннего общения. Ваше личное пространство для отдыха в цифровом мире.
                    </motion.p>
                </div>

                <motion.div 
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    className='flex items-center gap-3 text-purple-300/60 text-sm font-medium tracking-wide'
                >
                    <div className="h-px w-8 bg-purple-300/20" />
                    <Sparkles className='w-4 h-4' />
                    <span>ИСКУССТВО ОТДЫХАТЬ ВМЕСТЕ</span>
                </motion.div>
            </div>
        </div>
    );
};
