import { z } from 'zod'
import { invoke } from '@tauri-apps/api/core';

export const timestampSchema = z.array(z.object({
    name: z.string(),
    time_in_seconds: z.number()
})).or(z.undefined())

export const converterFormSchema = z.object({
    url: z
        .string()
        .url()
        .includes("twitch.tv/videos/", { message: "Invalid URL" }),
    name: z.string().min(1).refine(async (val) => {
        const response = await invoke('is_name_available', { name: val });
        console.log(response)
        return response
    }, { message: 'Name is already taken' })
});

export const timestampFormSchema = z.object({
    name: z.string().min(1)
})

export const m3u8Schema = z.array(z.string()).length(2);


