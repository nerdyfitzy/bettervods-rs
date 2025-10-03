import { Converter } from '@/components/forms';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/convert')({
    component: RouteComponent,
})

function RouteComponent() {
    useEffect(() => {
        const twitchScript = document.createElement('script');

        twitchScript.src = 'https://player.twitch.tv/js/embed/v1.js'
        document.body.appendChild(twitchScript);

        return () => {
            document.body.removeChild(twitchScript)
        }
    }, [])

    return (
        <Converter />
    );

}
