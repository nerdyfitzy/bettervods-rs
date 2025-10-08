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


function VideoPlayer({ link, name, timeRef, seekTimeRef, className }:
    { className?: string; link: string; name: string; seekTimeRef: React.RefObject<HTMLInputElement | null>; timeRef: React.RefObject<MediaPlayerInstance | null> }) {
    const { currentTime } = useStore(MediaPlayerInstance, timeRef);
    const seekTime = seekTimeRef.current?.value;
    useSeek(timeRef);

    console.log(seekTime)
    return (
        <>
            <MediaPlayer
                className={className}
                ref={timeRef}
                keyTarget="document"
                crossOrigin="anonymous"
                keyShortcuts={{
                    togglePaused: "k Space",
                    toggleMuted: "m",
                    toggleFullscreen: "f",

                    frameAdvance: {
                        keys: ["."],
                        onKeyDown({ event, remote }) {
                            remote.seeking(currentTime + 1 / 60, event);
                            remote.seek(currentTime + 1 / 60, event);
                        },
                    },
                    frameBackward: {
                        keys: [","],
                        onKeyDown({ event, remote }) {
                            remote.seeking(currentTime - 1 / 60, event);
                            remote.seek(currentTime - 1 / 60, event);
                        },
                    },
                    seekBackward: {
                        keys: ["j", "J", "ArrowLeft"],
                        onKeyDown({ event, remote }) {
                            remote.seeking(currentTime - (parseInt(seekTime || '5')), event);
                            remote.seek(currentTime - (parseInt(seekTime || '5')), event);
                        },
                    },
                    seekForward: {
                        keys: ["l", "L", "ArrowRight"],
                        onKeyDown({ event, remote }) {
                            remote.seeking(currentTime + (parseInt(seekTime || '5')), event);
                            remote.seek(currentTime + (parseInt(seekTime || '5')), event);
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
        </>
    );
}

export default VideoPlayer
