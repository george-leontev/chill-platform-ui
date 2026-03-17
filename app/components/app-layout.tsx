"use client";

import { Layout } from "antd";
import { usePathname } from "next/navigation";
import AppDrawer from "./app-drawer";

const { Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const hideDrawer = pathname === "/sign-in" || pathname === "/sign-up";

    return (
        <Layout className='min-h-screen bg-gray-50'>
            {!hideDrawer && <AppDrawer />}
            <Layout className={`bg-gray-50 ${!hideDrawer ? "ml-72.5" : ""}`}>
                {" "}
                {/* ← add bg-gray-50 */}
                <Content
                    className={
                        hideDrawer
                            ? "flex items-center justify-center min-h-screen bg-gray-50"
                            : "p-6 min-h-screen bg-gray-50"
                    }
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
