import { useEffect } from "react";

export function useTwitchScript() {
    useEffect(() => {
        const twitchScript = document.createElement('script');

        twitchScript.src = 'https://player.twitch.tv/js/embed/v1.js'
        document.body.appendChild(twitchScript);

        return () => {
            document.body.removeChild(twitchScript)
        }
    }, [])
}
