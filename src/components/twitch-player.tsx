import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { Player } from "@/types/twitch-player";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import { useMutation, useMutationState } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import Spinner from './ui/spinner';

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

const m3u8Schema = z.array(z.string()).length(2);

export const TwitchPlayer = ({ vod }: { vod: string }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)
    const navigate = useNavigate({ from: '/convert' })

    const variables = useMutationState({
        filters: {
            mutationKey: ['m3u8'],
            status: 'success'
        },
        select: (mutation) => mutation.state.data
    })

    const convertMutation = useMutation({
        mutationKey: ['convert'],
        mutationFn: (data: { m3u8: string, startTime: string, endTime: string, name: string }) => {
            const { m3u8, startTime, endTime, name } = data
            console.log(m3u8, startTime, endTime, name);
            return invoke('convert_from_m3u8', { url: m3u8, startTime, endTime, name })
        },
        onSuccess: () => navigate({ to: '/' }),
        onError: () => console.log('error oopsies')
    })

    useEffect(() => {
        const cleanup = initializePlayer(vod, setPlayer);

        return cleanup;
    }, [vod]);

    const dur = dayjs.duration(start * 1000);
    const endDur = dayjs.duration(end * 1000);

    function submitVod() {
        console.log(variables)
        const [m3u8, name] = m3u8Schema.parse(variables[variables.length - 1])
        const startTime = dur.format("HH:mm:ss")
        // const vodLength = player?.getDuration()
        // const endTime =
        //     start + 1800 >= (vodLength as number)
        //         ? dayjs.duration((vodLength as number) * 1000).format("HH:mm:ss")
        //         : dur.add({ minutes: 30 }).format("HH:mm:ss")
        const endTime = endDur.format("HH:mm:ss")
        convertMutation.mutate({ m3u8, startTime, endTime, name })
    }


    return (
        <>
            <h1 className='m-4 font-bold text-lg text-left'>Choose your start and end times. Note that longer VODs take longer to process.</h1>
            <div className="row-span-1 flex w-3/6 flex-col overflow-hidden rounded-lg border border-gray-950 bg-gray-950 shadow-md sm:col-span-2">
                <div id="vod-player" className="aspect-video w-full !rounded-lg" />
                <div className="flex flex-row w-full h-min justify-between p-4">
                    <div className="flex flex-row justify-around gap-4">
                        <Button variant="secondary" onClick={() => setStart(player?.getCurrentTime() as number)}>
                            Set start time
                        </Button>
                    </div>
                    <div>
                        <p className='text-xl'>{dur.format('HH:mm:ss')} - {endDur.format("HH:mm:ss")}</p>
                    </div>
                    <div>
                        <Button variant="secondary" onClick={() => setEnd(player?.getCurrentTime() as number)}>
                            Set end time
                        </Button>
                    </div>
                </div>
                <Button onClick={submitVod}>
                    {convertMutation.isPending ? <Spinner /> : 'Submit and download'}
                </Button>
            </div>
        </>
    )
}

