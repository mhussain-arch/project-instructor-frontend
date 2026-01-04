import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from '@/components/ui/sidebar'
import Link from 'next/link'

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader/>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Evaluation Type</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href='/practical'>
                                        <span>Practical</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}