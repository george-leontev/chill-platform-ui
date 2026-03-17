"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { LucideIcon } from "lucide-react";

interface DrawerNavItemProps {
    label: string;
    icon: LucideIcon;
    href: string;
    isActive: boolean;
}

export default function DrawerNavItem({ label, icon: Icon, href, isActive }: DrawerNavItemProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), {
        damping: 20,
        stiffness: 300,
    });

    const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), {
        damping: 20,
        stiffness: 300,
    });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;

        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width - 0.5) * 2;
        const yPct = (mouseY / height - 0.5) * 2;

        x.set(xPct * 100);
        y.set(yPct * 100);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <Link href={href}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={`
                    w-full flex items-center gap-3
                    cursor-pointer
                    px-4 py-3 rounded-lg
                    group
                    ${isActive
                        ? "bg-violet-100 text-violet-700 shadow-md"
                        : "text-gray-700 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm"
                    }
                `}
            >
                <Icon
                    size={20}
                    className={
                        isActive
                            ? "text-violet-700"
                            : "text-gray-500 group-hover:text-violet-700"
                    }
                />
                <span className='font-medium'>{label}</span>
            </motion.div>
        </Link>
    );
}
