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

export const Route = createFileRoute('/videos/$videoTitle')({
    component: RouteComponent,
    loader: async ({ params }) => {
        return invoke('get_full_path', { name: params.videoTitle })
    }
})

function RouteComponent() {
    //i wanna switch to trpc and rewrite this so its way cleaner and easier to follow.
    //for now this is what is written and it is fine and it works
    const loaderData = Route.useLoaderData()
    const { videoTitle } = Route.useParams()

    return (
        <section className="flex w-full flex-row items-center justify-center gap-4 p-4">
            <div className="w-2/3">
                <h1 className="mb-2 text-3xl font-bold">{videoTitle}</h1>
                <VideoPlayer link={loaderData as string} name={videoTitle} key={videoTitle} />
            </div>
            <Card className="w-1/3 h-full px-8 py-2 rounded-xs">
                <CardTitle className="mb-4 text-start text-2xl flex flex-row justify-between items-center">
                    Timestamps
                    <Button size="icon" variant="ghost" asChild><Plus /></Button>
                </CardTitle>
                <CardContent className="flex flex-col gap-2 justify-start items-start">
                    <Timestamp
                        key={2}
                        title={"fullhop nair"}
                        timeInSeconds={200}
                    />
                </CardContent>
            </Card>
        </section>
    );
}
