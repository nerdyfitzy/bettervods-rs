import { useState } from "react";
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

const converterFormSchema = z.object({
    url: z
        .string()
        .url()
        .includes("twitch.tv/videos/", { message: "Invalid URL" })
});

export function Converter() {
    const form = useForm<z.infer<typeof converterFormSchema>>({
        resolver: zodResolver(converterFormSchema),
        defaultValues: {
            url: "",
        },
    });

    const [vodId, setVodId] = useState<string | null>(null)
    const [error, setError] = useState<boolean>(false)

    function onSubmit(values: z.infer<typeof converterFormSchema>) {
        console.log(values.url);

        const parts = values.url.split('/')
        const vodId = parts[parts.length - 1]
        if (typeof vodId == "string") {
            setVodId(vodId)

        } else {
            setError(true)
        }
    }
    return (
        <>
            {
                (!vodId) ?
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-1/3 rounded-lg border-2 border-slate-300 bg-card p-8 drop-shadow-lg"
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
                            {error ? <p>Invalid VOD link. Please make sure it follows the conventions in the placeholder above.</p> : <></>}
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                    : <TwitchPlayer vod={vodId as string} />
            }
        </>
    );
}
