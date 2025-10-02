import { Link } from "@tanstack/react-router"
import { Button } from "../ui/button"
import { openPath } from "@tauri-apps/plugin-opener"
import { invoke } from "@tauri-apps/api/core"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu } from "../ui/sidebar"

const routes = [
    {
        title: "Browse your VODs",
        url: "/",
    },
    {
        title: "Add new VOD",
        url: "/convert",
    },
    {
        title: "Support my work!",
        url: "/support",
    },
]

function AppSidebar() {
    const open = () => {
        invoke('get_full_path', { name: ' ' })
            .then((name) => {
                openPath(String(name).trim())
            })
    }

    return (
        <Sidebar className="dark text-white flex flex-col justify-start gap-16">
            <SidebarHeader className="flex flex-col items-center mt-4 mb-10">
                <Link to='/'>
                    <h1 className="text-2xl font-bold text-white">
                        better<span className="text-purple-500">vods</span>
                    </h1>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col items-center gap-6">
                            {routes.map(route => (
                                <Button variant="outline" asChild className="w-48">
                                    <Link to={route.url}>
                                        {route.title}
                                    </Link>
                                </Button>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex flex-col items-center">
                <Button onClick={open} variant="secondary" className="absolute bottom-8 w-48">
                    Open VOD folder
                </Button>
            </SidebarFooter>
        </Sidebar>
    )

    return (
        <header className="bg-background dark text-white flex h-screen w-1/6 flex-col justify-start gap-16 border-b border-b-slate-300 p-8">
            <Link to='/'>
                <h1 className="text-2xl font-bold text-white">
                    better<span className="text-purple-500">vods</span>
                </h1>
            </Link>

            <nav className="flex flex-col gap-6">
                <Button variant="outline" asChild>
                    <Link to='/'>
                        Browse your VODs
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link to='/convert'>
                        Add new VOD
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link to='/support'>
                        Support my work!
                    </Link>
                </Button>
                <Button onClick={open} variant="secondary" className="absolute bottom-8">
                    Open VOD folder
                </Button>

            </nav>
        </header>
    )
}

export default AppSidebar
