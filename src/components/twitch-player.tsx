import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from '@tanstack/react-router';
import Spinner from './ui/spinner';
import { useTwitchPlayer } from '@/hooks/useTwitchPlayer';
import { useM3u8State } from '@/hooks/useM3u8State';
import { useConvertMutation } from '@/hooks/useConvertMutation';
import { m3u8Schema } from '@/lib/schema';

dayjs.extend(duration)


export const TwitchPlayer = ({ vod }: { vod: string }) => {
    const player = useTwitchPlayer(vod);
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)
    const navigate = useNavigate({ from: '/convert' })

    const variables = useM3u8State();
    const convertMutation = useConvertMutation(navigate)

    const dur = dayjs.duration(start * 1000);
    const endDur = dayjs.duration(end * 1000);

    function submitVod() {
        const [m3u8, name] = m3u8Schema.parse(variables[variables.length - 1])
        const startTime = dur.format("HH:mm:ss")
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

