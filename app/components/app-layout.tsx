"use client";

import { Layout, Avatar, Divider } from "antd";
import { Home, MessageCircle, FileText, Heart, User, LifeBuoy } from "lucide-react";
import Image from "next/image";
import AppDrawer from "./app-drawer";

const { Sider, Content } = Layout;

const navItems = [
    { label: "Home", icon: Home },
    { label: "Chats", icon: MessageCircle },
    { label: "My Posts", icon: FileText },
    { label: "Liked", icon: Heart },
    { label: "Profile", icon: User },
    { label: "Help & Support", icon: LifeBuoy },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout className='min-h-screen bg-gray-50'>
            <AppDrawer />

            <Layout>
                <Content className='p-6'>{children}</Content>
            </Layout>
        </Layout>
    );
}
