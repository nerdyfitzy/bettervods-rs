import { Player } from "@/types/twitch-player";
import { useEffect, useState } from "react";

const initializePlayer = (
    id: string,
    callback: (player: Player) => void
): (() => void) => {
    console.log("init player")
    const clearCurrent = () => {
        const playerElement = document.getElementById("vod-player");
        if (playerElement) {
            playerElement.innerHTML = "";
        }
    };

    if (!(window as any).Twitch) {
        const timeout = setTimeout(() => initializePlayer(id, callback), 100);
        return () => {
            clearTimeout(timeout);
            clearCurrent();
        };
    }

    const options = {
        width: "100%",
        height: "100%",
        video: id,
        autoplay: false,
    };
    const player = new (window as any).Twitch!.Player(
        "vod-player",
        options
    ) as Player;

    callback(player);

    return () => {
        console.log(player);
        clearCurrent();
    };
};


export function useTwitchPlayer(vod: string) {
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const cleanup = initializePlayer(vod, setPlayer);

        return cleanup;
    }, [vod]);

    return player;
}
