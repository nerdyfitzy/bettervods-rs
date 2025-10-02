import { Card, CardContent } from "@/components/ui/card";
import { useFullPathQuery } from "@/hooks/useFullPathQuery";
import { Link } from "@tanstack/react-router";
import { convertFileSrc } from "@tauri-apps/api/core";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";

function Video({ title }: { title: string; id?: number }) {
    const { data, isError } = useFullPathQuery(title)

    if (isError) return null;

    return (
        <Link to='/videos/$videoTitle' params={{ videoTitle: title }}>
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
        </Link>
    );
}

export default Video;
