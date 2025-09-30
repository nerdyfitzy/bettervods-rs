import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import ReactQueryProvider from '@/lib/Providers'
import Header from '@/components/layout/header'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <React.Fragment>
            <ReactQueryProvider>
                <main className="dark bg-background text-white h-screen w-screen flex flex-row justify-start items-center">
                    <Header />
                    <Outlet />
                </main>
            </ReactQueryProvider>
        </React.Fragment>
    )
}
