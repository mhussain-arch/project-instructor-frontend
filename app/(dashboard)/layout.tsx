import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="p-4">
                    <SidebarTrigger />
                </div>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </main>
        </SidebarProvider>
    );
}