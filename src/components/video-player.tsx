import React from "react";
import {
    MediaPlayer,
    MediaPlayerInstance,
    MediaProvider,
    Poster,
    useStore,
} from "@vidstack/react";
import {
    DefaultVideoLayout,
    defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useSeek } from "@/hooks/useSeek";


function VideoPlayer({ link, name, timeRef }: { link: string; name: string; timeRef: React.RefObject<MediaPlayerInstance | null> }) {
    const { currentTime } = useStore(MediaPlayerInstance, timeRef);
    useSeek(timeRef);

    return (
        <MediaPlayer
            ref={timeRef}
            keyTarget="document"
            crossOrigin="anonymous"
            keyShortcuts={{
                togglePaused: "k Space",
                toggleMuted: "m",
                toggleFullscreen: "f",
                seekBackward: ["j", "J", "ArrowLeft"],
                seekForward: ["l", "L", "ArrowRight"],

                frameAdvance: {
                    keys: ["."],
                    onKeyDown({ event, remote }) {
                        remote.seeking(currentTime + 1 / 60, event);
                        remote.seek(currentTime + 1 / 60, event);
                    },
                },
            }}
            src={convertFileSrc(link)}
            viewType="video"
            streamType="on-demand"
            logLevel="warn"
            playsInline
            title={name}
        >
            <MediaProvider>
                <Poster className="vds-poster" />
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
    );
}

export default VideoPlayer
