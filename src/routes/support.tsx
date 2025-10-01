import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { openUrl } from '@tauri-apps/plugin-opener'

export const Route = createFileRoute('/support')({
    component: RouteComponent,
})

function RouteComponent() {

    const open = () => {
        openUrl("https://github.com/nerdyfitzy")
    }

    return (
        <div className="flex w-full flex-col self-center justify-self-center items-center justify-center gap-4 p-8 text-center">
            <h1>I try my best to create useful melee tools.</h1>
            <p>If you want to (unexpectedly) support my development, it would be much appreciated as always.</p>
            <Button variant='outline' onClick={open}>
                Github
            </Button>
        </div>
    )

}
