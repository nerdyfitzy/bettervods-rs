import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import VideoPlayer from "@/components/video-player";
import { invoke } from '@tauri-apps/api/core';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Timestamp from '@/components/timestamp';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimestampForm } from '@/components/forms';
import { useEffect, useRef, useState } from 'react';
import { MediaPlayerInstance } from '@vidstack/react';
import { useMutationState } from '@tanstack/react-query';
import z from 'zod';

export const Route = createFileRoute('/videos/$videoTitle')({
    component: RouteComponent,
    loader: async ({ params }) => {
        const pathPromise = invoke('get_full_path', { name: params.videoTitle })
        const timestampPromise = invoke('get_all_timestamps_for_video', { name: params.videoTitle })
        const [path, initTimestamps] = await Promise.all([
            pathPromise, timestampPromise
        ])

        return [path, initTimestamps]
    }
})

const timestampSchema = z.array(z.object({
    name: z.string(),
    time_in_seconds: z.number()
})).or(z.undefined())


function RouteComponent() {
    const [path, initTimestamps] = Route.useLoaderData()
    const { videoTitle } = Route.useParams();
    const timeRef = useRef<MediaPlayerInstance>(null);

    const variables = useMutationState({
        filters: {
            mutationKey: ['add_timestamp']
        },
        select: (mutation) => mutation.state.variables
    })

    //@ts-ignore
    const [timestamps, setTimestamps] = useState<z.infer<typeof timestampSchema>>(initTimestamps)

    useEffect(() => {
        if (variables.length > 0) {
            //@ts-ignore
            setTimestamps([variables[variables.length - 1], ...timestamps])
        }
    }, [variables])


    console.log(timestamps)

    return (
        <section className="flex w-full flex-row items-center justify-center gap-4 p-4">
            <div className="w-2/3">
                <h1 className="mb-2 text-3xl font-bold">{videoTitle}</h1>
                <VideoPlayer timeRef={timeRef} link={path as string} name={videoTitle} key={videoTitle} />
            </div>
            <Card className="w-1/3 h-full px-8 py-2 rounded-xs">
                <CardTitle className="mb-4 text-start text-2xl flex flex-row justify-between items-center">
                    Timestamps
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="icon" variant="ghost" className='rounded-full border' asChild><Plus /></Button>
                        </PopoverTrigger>
                        <PopoverContent className='dark'>
                            <TimestampForm timeRef={timeRef} fileName={videoTitle} />
                        </PopoverContent>
                    </Popover>
                </CardTitle>
                <CardContent className="flex flex-col gap-2 justify-start items-start">
                    {timestamps ? timestamps.map(ts =>
                        <Timestamp key={ts.name} title={ts.name} timeInSeconds={ts.time_in_seconds} />
                    ) : <EmptyList />}
                </CardContent>
            </Card>
        </section>
    );
}

function EmptyList() {
    return (
        <div className="flex w-full flex-col self-center justify-self-center items-center justify-center gap-4 p-8 text-center">
            <p className="text-gray-300">No timestamps yet</p>
        </div>
    );
}
