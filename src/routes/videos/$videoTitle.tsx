import { createFileRoute } from '@tanstack/react-router'
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import VideoPlayer from "@/components/video-player";
import { invoke } from '@tauri-apps/api/core';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable';
import { useRef } from 'react';
import { MediaPlayerInstance } from '@vidstack/react';
import TimestampCard from '@/components/timestamp';
import { timestampSchema } from '@/lib/schema';

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


function RouteComponent() {
    const [path, initTimestamps] = Route.useLoaderData()
    const { videoTitle } = Route.useParams();
    const timeRef = useRef<MediaPlayerInstance>(null);
    const parsedTimestamps = timestampSchema.parse(initTimestamps)

    return (
        <section className="w-full ">
            <h1 className="px-4 mb-2 text-3xl font-bold">{videoTitle}</h1>
            <ResizablePanelGroup className="w-full flex flex-row items-center justify-center gap-4 p-4" direction='horizontal'>
                <ResizablePanel defaultSize={65}>
                    <VideoPlayer timeRef={timeRef} link={path as string} name={videoTitle} key={videoTitle} />
                </ResizablePanel>
                <ResizableHandle className='h-full' withHandle />
                <ResizablePanel>
                    <TimestampCard initTimestamps={parsedTimestamps} timeRef={timeRef} videoTitle={videoTitle} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}

