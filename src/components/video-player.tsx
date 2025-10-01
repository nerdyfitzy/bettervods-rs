import { useRef } from "react";
import {
    isHLSProvider,
    MediaPlayer,
    MediaPlayerInstance,
    MediaProvider,
    type MediaProviderAdapter,
    type MediaProviderChangeEvent,
    Poster,
    useStore,
} from "@vidstack/react";
import {
    DefaultVideoLayout,
    defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent,
) {
    if (isHLSProvider(provider)) {
        // Static import
        // Or, dynamic import
    }
}

function VideoPlayer({ link, name }: { link: string; name: string }) {
    const ref = useRef<MediaPlayerInstance>(null),
        { currentTime } = useStore(MediaPlayerInstance, ref);
    return (
        <MediaPlayer
            onProviderChange={onProviderChange}
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
            src={link}
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
