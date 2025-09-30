import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useRef, useState } from "react";
import { Player } from "@/types/twitch-player";
import { Button } from "@/components/ui/button";
import { z } from 'zod';

dayjs.extend(duration)

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


export const TwitchPlayer = ({ vod }: { vod: string }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [start, setStart] = useState(0)

    useEffect(() => {
        const cleanup = initializePlayer(vod, setPlayer);

        return cleanup;
    }, [vod]);
    const dur = dayjs.duration(start * 1000);

    return (
        <>
            <h1 className='m-4 font-bold text-lg text-left'>Choose your start time, VODs are saved in 30 minute increments.</h1>
            <div className="row-span-1 flex w-3/6 flex-col overflow-hidden rounded-lg border border-gray-950 bg-gray-950 shadow-md sm:col-span-2">
                <div id="vod-player" className="aspect-video w-full !rounded-lg" />
                <div className="flex flex-row w-full h-min justify-between p-4">
                    <div className="flex flex-row justify-around gap-4">
                        <Button variant="secondary" onClick={() => setStart(player?.getCurrentTime() as number)}>
                            Set start time
                        </Button>
                    </div>
                    <div>
                        <p className='text-xl'>{dur.format('HH:mm:ss')} - {dur.add({ minutes: 30 }).format("HH:mm:ss")}</p>
                    </div>
                    <div>
                        <Button >Submit and upload</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

