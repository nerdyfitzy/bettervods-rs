import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import ReactQueryProvider from '@/lib/Providers'
import Footer from '@/components/layout/footer'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/app-sidebar'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <React.Fragment>
            <ReactQueryProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <main className="dark bg-background text-white h-screen w-screen flex flex-row justify-start items-center">
                        <SidebarTrigger />
                        <Outlet />
                        <Footer />
                    </main>
                </SidebarProvider>
            </ReactQueryProvider>
        </React.Fragment>
    )
}
