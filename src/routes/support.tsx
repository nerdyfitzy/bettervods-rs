import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { openUrl } from '@tauri-apps/plugin-opener'
import Github from '../../public/Github.svg'
import Patreon from '../../public/Patreon.svg'

export const Route = createFileRoute('/support')({
    component: RouteComponent,
})

function RouteComponent() {

    const open = (string: 'git' | 'patreon') => {
        switch (string) {
            case 'git':
                openUrl("https://github.com/nerdyfitzy")
                break;
            case 'patreon':
                openUrl("https://www.patreon.com/cw/nerdyfitzy")
        }
    }

    return (
        <div className="flex w-full flex-col self-center justify-self-center items-center justify-center gap-4 p-8 text-center">
            <h1>I try my best to create useful melee tools.</h1>
            <p>If you want to (unexpectedly) support my development, it would be very appreciated.</p>
            <div className='w-1/3 flex flex-row justify-between'>
                <Button variant='outline' className='h-20 w-20' onClick={() => open('git')}>
                    <img src={Github} />
                </Button>

                <Button variant='outline' className='h-20 w-20' onClick={() => open('patreon')}>
                    <img src={Patreon} />
                </Button>
            </div>
        </div>
    )

}
