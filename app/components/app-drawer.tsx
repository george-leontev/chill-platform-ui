"use client";

import { Avatar, Divider } from "antd";
import Sider from "antd/es/layout/Sider";
import { Home, MessageCircle, FileText, Heart, User, LifeBuoy } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMessages } from "../contexts/messages-context";
import { useProfile } from "../contexts/profile-context";
import { useAuth } from "../contexts/app-auth-context";
import DrawerNavItem from "./drawer-nav-item";

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
    const { user } = useAuth();

    const displayName = profile?.id ? (profile.location || "User") : user?.email?.split("@")[0] || "User";
    const avatarUrl = profile?.avatarUrl || "https://i.pravatar.cc/100";

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
                <div className='border-t border-gray-100 p-4 bg-violet-50/40 shrink-0'>
                    <div className='flex items-center gap-3'>
                        <Avatar size={44} src={avatarUrl} className='ring-2 ring-violet-500' />

                        <div className='flex flex-col leading-tight'>
                            <span className='font-semibold text-gray-800'>{displayName}</span>
                            <span className='text-xs text-gray-500'>@{user?.email?.split("@")[0] || "user"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Sider>
    );
}
