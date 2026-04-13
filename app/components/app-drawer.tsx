"use client";

import { Avatar, Divider, Dropdown } from "antd";
import type { MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { Home, MessageCircle, FileText, Heart, User, LifeBuoy, LogOut, ChevronUp } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMessages } from "../contexts/messages-context";
import { useProfile } from "../contexts/profile-context";
import { useAuth } from "../contexts/app-auth-context";
import DrawerNavItem from "./drawer-nav-item";
import { useState } from "react";

const navItems = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Chats", icon: MessageCircle, href: "/chats" },
    { label: "My Posts", icon: FileText, href: "/my-posts" },
    { label: "Liked", icon: Heart, href: "/liked" },
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Help & Support", icon: LifeBuoy, href: "/help" },
];

export default function AppDrawer() {
    const pathname = usePathname();
    const { hasUnreadMessages } = useMessages();
    const { profile } = useProfile();
    const { user, signOut } = useAuth();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const displayName = profile?.id ? (profile.location || "User") : user?.email?.split("@")[0] || "User";
    const avatarUrl = profile?.avatarUrl || "/chill-guy.png";

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await signOut();
        setIsSigningOut(false);
    };

    const userMenuItems: MenuProps["items"] = [
        {
            key: "sign-out",
            icon: <LogOut size={16} />,
            label: "Sign Out",
            danger: true,
        },
    ];

    return (
        <Sider width={290} theme='light' className='!fixed top-0 left-0 h-screen border-r border-gray-100 z-50'>
            <div className='flex flex-col h-full overflow-y-auto'>
                {/* HEADER */}
                <div className='flex items-center gap-6 px-6 py-5 border-b border-gray-100'>
                    <Image src={"/chill-guy.png"} width={36} height={36} alt='chill-guy' />
                    <h2 className='text-lg font-semibold text-gray-800'>ChillZone</h2>
                </div>

                {/* NAVIGATION */}
                <div className='flex-1 p-3 flex flex-col gap-1'>
                    {navItems.map((item, i) => {
                        const isActive = pathname === item.href;
                        const showUnreadDot = item.href === "/chats" && hasUnreadMessages;
                        return <DrawerNavItem key={i} {...item} isActive={isActive} showUnreadDot={showUnreadDot} />;
                    })}

                    <Divider className='my-4' />
                </div>

                {/* PROFILE */}
                <div className='border-t border-gray-100 bg-violet-50/40 shrink-0'>
                    <Dropdown
                        menu={{
                            items: userMenuItems,
                            onClick: handleSignOut,
                        }}
                        placement='topLeft'
                        trigger={["click"]}
                    >
                        <button
                            className='w-full flex items-center gap-3 p-4 hover:bg-violet-100/50 transition cursor-pointer group'
                            disabled={isSigningOut}
                        >
                            <Avatar size={44} src={avatarUrl} className='ring-2 ring-violet-500' />

                            <div className='flex-1 flex flex-col leading-tight text-left'>
                                <span className='font-semibold text-gray-800 truncate'>{displayName}</span>
                                <span className='text-xs text-gray-500 truncate'>
                                    @{user?.email?.split("@")[0] || "user"}
                                </span>
                            </div>

                            <ChevronUp size={16} className='text-gray-400 group-hover:text-gray-600 transition' />
                        </button>
                    </Dropdown>
                </div>
            </div>
        </Sider>
    );
}
