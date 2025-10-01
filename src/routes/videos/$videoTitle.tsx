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
import { useRef, useState } from 'react';
import { MediaPlayerInstance } from '@vidstack/react';
import { listen } from '@tauri-apps/api/event'

export const Route = createFileRoute('/videos/$videoTitle')({
    component: RouteComponent,
    loader: async ({ params }) => {
        return invoke('get_full_path', { name: params.videoTitle })
    }
})

type Timestamp = {
    name: string;
    time_in_seconds: number;
}


function RouteComponent() {
    //i wanna switch to trpc and rewrite this so its way cleaner and easier to follow.
    //for now this is what is written and it is fine and it works

    const [timestamps, setTimestamps] = useState<Timestamp[]>([])
    const loaderData = Route.useLoaderData()
    const { videoTitle } = Route.useParams();
    const timeRef = useRef<MediaPlayerInstance>(null);

    listen<Timestamp[]>('new-timestamp', (event) => setTimestamps(event.payload))

    return (
        <section className="flex w-full flex-row items-center justify-center gap-4 p-4">
            <div className="w-2/3">
                <h1 className="mb-2 text-3xl font-bold">{videoTitle}</h1>
                <VideoPlayer timeRef={timeRef} link={loaderData as string} name={videoTitle} key={videoTitle} />
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
                    {timestamps.map(ts => <Timestamp key={ts.name} title={ts.name} timeInSeconds={ts.time_in_seconds} />)}
                </CardContent>
            </Card>
        </section>
    );
}
