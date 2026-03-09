"use client";

import { Avatar, Divider } from "antd";
import Sider from "antd/es/layout/Sider";
import { Home, MessageCircle, FileText, Heart, User, LifeBuoy } from "lucide-react";
import Image from "next/image";

const navItems = [
    { label: "Home", icon: Home },
    { label: "Chats", icon: MessageCircle },
    { label: "My Posts", icon: FileText },
    { label: "Liked", icon: Heart },
    { label: "Profile", icon: User },
    { label: "Help & Support", icon: LifeBuoy },
];

export default function AppDrawer() {
    return (
        <Sider width={290} theme='light' className='min-h-screen border-r border-gray-100 flex flex-col'>
            <div className='flex flex-col h-full'>
                {/* HEADER */}
                <div className='flex items-center gap-6 px-6 py-5 border-b border-gray-100'>
                    <Image src={"/chill-guy.png"} width={36} height={36} alt='chill-guy' />
                    <h2 className='text-lg font-semibold text-gray-800'>Chill Platform</h2>
                </div>

                {/* NAVIGATION */}
                <div className='flex-1 p-3 overflow-y-auto'>
                    {navItems.map((item, i) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={i}
                                className='
                                        w-full flex items-center gap-3
                                        cursor-pointer
                                        px-4 py-3 rounded-lg
                                        text-gray-700
                                        transition
                                        hover:bg-gray-100
                                        hover:text-violet-600
                                        group
                                    '
                            >
                                <Icon size={20} className='text-gray-500 group-hover:text-violet-600' />

                                <span className='font-medium'>{item.label}</span>
                            </button>
                        );
                    })}

                    <Divider className='my-4' />
                </div>

                {/* PROFILE */}
                <div className='border-t border-gray-100 p-4 bg-violet-50/40'>
                    <div className='flex items-center gap-3'>
                        <Avatar size={44} src='https://i.pravatar.cc/100' className='ring-2 ring-violet-500' />

                        <div className='flex flex-col leading-tight'>
                            <span className='font-semibold text-gray-800'>John Doe</span>

                            <span className='text-xs text-violet-600 font-medium'>Member</span>

                            <span className='text-xs text-gray-500'>@johndoe</span>
                        </div>
                    </div>
                </div>
            </div>
        </Sider>
    );
}
