import { createFileRoute } from '@tanstack/react-router'
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import VideoPlayer from "@/components/video-player";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useMediaRemote } from "@vidstack/react";

export const Route = createFileRoute('/videos/$videoTitle')({
    component: RouteComponent,
})

function RouteComponent() {
    //i wanna switch to trpc and rewrite this so its way cleaner and easier to follow.
    //for now this is what is written and it is fine and it works
    const slug = (await params).id;

    const remote = useMediaRemote();
    const seek = (timeInSeconds: number) => {
        remote.seeking(timeInSeconds);
        remote.seek(timeInSeconds);
    };

    return (
        <section className="flex w-full flex-row items-center justify-center gap-4 p-4">
            <div className="w-2/3">
                <h1 className="mb-2 text-3xl font-bold">{res.name}</h1>
                <VideoPlayer link={url} name={res.name} key={res.id} />
            </div>
        </section>
    );
}
