import React, { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TwitchPlayer } from "./twitch-player";
import { useMutation } from "@tanstack/react-query";
import { getVod } from "@/lib/get-twitch-url";
import { Label } from "./ui/label";
import { invoke } from "@tauri-apps/api/core";
import { MediaPlayerInstance } from "@vidstack/react";

const converterFormSchema = z.object({
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

const timestampFormSchema = z.object({
    name: z.string().min(1)
})

export function Converter() {
    const form = useForm<z.infer<typeof converterFormSchema>>({
        resolver: zodResolver(converterFormSchema),
        defaultValues: {
            url: "",
            name: ""
        },
    });

    const [vodId, setVodId] = useState<string | null>(null)
    const [error, setError] = useState<boolean>(false)
    const mutation = useMutation({
        mutationKey: ['m3u8'],
        mutationFn: (data: { url: string, name: string }) => {
            return getVod(data.url, data.name)
        },
        onSuccess: () => console.log('success!')
    })

    function onSubmit(values: z.infer<typeof converterFormSchema>) {
        console.log(values.url);

        const parts = values.url.split('/')
        const vodId = parts[parts.length - 1]
        if (typeof vodId == "string") {
            setVodId(vodId)
            mutation.mutate({ url: values.url, name: values.name })
        } else {
            setError(true)
        }
    }
    return (
        <>
            <section className="w-full h-full flex flex-col justify-center items-center">

                {
                    (!vodId) ?
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 w-1/3 rounded-lg border-2 border-slate-300 bg-card p-8 drop-shadow-lg"
                            >
                                <h2 className="text-xl font-bold">Enter Twitch VOD URL</h2>
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://twitch.tv/videos/128307129736"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Label htmlFor="name">VOD Name</Label>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="fitzy vs Zain at Genesis"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {error ? <p>Invalid VOD link. Please make sure it follows the conventions in the placeholder above.</p> : <></>}
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                        : <TwitchPlayer vod={vodId as string} />
                }
            </section>
        </>
    );
}

export function TimestampForm({ timeRef, fileName }: { fileName: string; timeRef: React.RefObject<MediaPlayerInstance | null> }) {
    const form = useForm<z.infer<typeof timestampFormSchema>>({
        resolver: zodResolver(timestampFormSchema),
        defaultValues: {
            name: "",
        },
    });

    const mutation = useMutation({
        mutationKey: ['add_timestamp'],
        mutationFn: ({ name, time_in_seconds }: { name: string; time_in_seconds: number }) =>
            invoke('create_timestamp', { file_name: fileName, name, time_in_seconds })

    })

    function onSubmit(values: z.infer<typeof timestampFormSchema>) {
        console.log(values.name);
        console.log(timeRef.current?.state.currentTime)

        mutation.mutate({ name: values.name, time_in_seconds: timeRef.current?.state.currentTime as number })
    }
    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 drop-shadow-lg"
                >
                    <h2 className="text-md font-bold">Enter timestamp name</h2>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Bad nair"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}
