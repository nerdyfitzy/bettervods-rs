import { z } from "zod";
import { fetch } from "@tauri-apps/plugin-http";

//1080p60
//720p60

const responseSchema = z.object({
    data: z.object({
        video: z.object({
            broadcastType: z.string(),
            createdAt: z.string(),
            seekPreviewsURL: z.string(),
            owner: z.object({ login: z.string() }),
            title: z.string(),
        }),
    }),
    extensions: z.object({
        durationMilliseconds: z.number(),
        requestID: z.string(),
    }),
});


export const getVod = async (url: string, name: string) => {
    const id = url.split("videos/")[1]?.split("?")[0];
    console.log(id, "id");
    const resp = await fetch("https://gql.twitch.tv/gql", {
        method: "POST",
        body: JSON.stringify({
            query: `query { video(id: "${id}") { broadcastType, createdAt, seekPreviewsURL, owner { login }, title }}`,
        }),
        headers: {
            "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    const data = responseSchema.parse(await resp.json());

    const vodData = data.data.video;
    const owner = vodData.owner.login;
    const title = vodData.title;

    const currentURL = new URL(vodData.seekPreviewsURL);
    const domain = currentURL.host;
    const paths = currentURL.pathname.split("/");
    const vodSpecialID =
        paths[paths.findIndex((element) => element.includes("storyboards")) - 1];

    const now = new Date("2023-02-10");
    const created = new Date(vodData.createdAt);
    const timeDifference = now.getTime() - created.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const broadcastType = vodData.broadcastType.toLowerCase();

    const finalUrl =
        broadcastType === "highlight"
            ? `https://${domain}/${vodSpecialID}/720p60/highlight-${id}.m3u8`
            : broadcastType === "upload" && daysDifference > 7
                ? `https://${domain}/${owner}/${id}/${vodSpecialID}/720p60/index-dvr.m3u8`
                : `https://${domain}/${vodSpecialID}/720p60/index-dvr.m3u8`;

    console.log(title, finalUrl);

    return [finalUrl, name];
};
