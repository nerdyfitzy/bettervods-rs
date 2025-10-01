import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";

function Video({ title }: { title: string; id?: number }) {
    const { data, isError } = useQuery({
        queryKey: ['full_path', title],
        queryFn: () => invoke('get_full_path', { name: title })
    })

    if (isError) return null;

    return (
        // <Link className="w-16" to='/videos/$videoTitle' params={{ videoTitle: title }}>
        <Card className="max-w-fit min-h-fit border-2 bg-card p-8 shadow-md drop-shadow-xl hover:bg-slate-800">
            <CardContent className="flex flex-col gap-4">
                <MediaPlayer
                    keyTarget="document"
                    src={convertFileSrc(data as string)}
                    viewType="video"
                    logLevel="warn"
                    playsInline
                    className="w-44 h-32"
                    title={title}
                >
                    <MediaProvider>
                        <Poster className="vds-poster" />
                    </MediaProvider>
                </MediaPlayer>

                <div className="flex flex-row justify-start">
                    <p className="text-lg font-bold">{title}</p>
                </div>
            </CardContent>
        </Card>
        // </Link>
    );
}

export default Video;
