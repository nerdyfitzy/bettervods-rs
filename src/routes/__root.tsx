import * as React from 'react'
import { useEffect } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import ReactQueryProvider from '@/lib/Providers'
import Footer from '@/components/layout/footer'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/app-sidebar'
import { Toaster } from 'sonner'
import { checkForAppUpdates } from '@/updater'
import { invoke } from '@tauri-apps/api/core'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    useEffect(() => {
        //@ts-ignore
        checkForAppUpdates().then((_) => console.log('done'));
        invoke('read_timestamps_from_json')
            .then(_ => console.log('read'))
    }, [])
    return (
        <React.Fragment>
            <ReactQueryProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <main className="dark bg-background text-white h-screen w-screen flex flex-row justify-start items-center">
                        <SidebarTrigger />
                        <Outlet />
                    </main>
                    <Footer />
                    <Toaster />
                </SidebarProvider>
            </ReactQueryProvider>
        </React.Fragment>
    )
}
