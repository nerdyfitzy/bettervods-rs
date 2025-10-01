import { useRef } from "react";
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


function VideoPlayer({ link, name }: { link: string; name: string }) {
    const ref = useRef<MediaPlayerInstance>(null),
        { currentTime } = useStore(MediaPlayerInstance, ref);

    console.log(convertFileSrc(link))
    return (
        <MediaPlayer
            ref={ref}
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

        // <video width="750" height="500" controls>
        //     <source src={convertFileSrc(link)} type="video/mp4" />
        // </video>
    );
}

export default VideoPlayer
