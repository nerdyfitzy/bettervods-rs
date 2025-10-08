import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { QueryClient, useMutation, useMutationState } from "@tanstack/react-query";
import { TimestampForm } from "./forms";
import { ScrollArea } from "./ui/scroll-area";
import React, { useEffect, useState } from "react";
import { MediaPlayerInstance } from "@vidstack/react";
import { z } from 'zod'
import { Plus, Trash } from "lucide-react";
import { timestampSchema } from "@/lib/schema";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
import { invoke } from "@tauri-apps/api/core";


function TimestampCard({ videoTitle, timeRef, initTimestamps }: { initTimestamps: z.infer<typeof timestampSchema>; videoTitle: string; timeRef: React.RefObject<MediaPlayerInstance | null> }) {
    const createVariables = useMutationState({
        filters: {
            mutationKey: ['add_timestamp']
        },
        select: (mutation) => mutation.state.variables
    })

    const deleteVariables = useMutationState({
        filters: {
            mutationKey: ['delete']
        },
        select: (mutation) => mutation.state.data
    })


    const [timestamps, setTimestamps] = useState<z.infer<typeof timestampSchema>>(initTimestamps)

    useEffect(() => {
        if (createVariables.length > 0) {
            //@ts-ignore
            setTimestamps([createVariables[createVariables.length - 1], ...timestamps].sort((a, b) => a - b))
        }
    }, [createVariables])

    useEffect(() => {
        console.log(deleteVariables)
        if (deleteVariables.length > 0) {
            let ts: z.infer<typeof timestampSchema> = [];
            timestamps?.forEach(timestamp => {
                if (timestamp.name !== deleteVariables[deleteVariables.length - 1]) ts.push(timestamp);
            })
            console.log(ts, 'del')
            setTimestamps(ts)
        }
    }, [deleteVariables])

    return (
        <Card className="h-90 px-8 py-2 rounded-xs">
            <CardTitle className="mb-4 text-start text-2xl flex flex-row justify-between items-center">
                Timestamps
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost" className='rounded-full border-violet-700 border' asChild><Plus /></Button>
                    </PopoverTrigger>
                    <PopoverContent className='dark'>
                        <TimestampForm timeRef={timeRef} fileName={videoTitle} />
                    </PopoverContent>
                </Popover>
            </CardTitle>
            <CardContent className='overflow-y-hidden px-0'>
                <ScrollArea className='w-full h-full pr-4'>
                    <div className="w-full flex flex-col gap-2 justify-start items-start">
                        {/* @ts-ignore */}
                        {timestamps?.length > 0 ? timestamps.map(ts =>
                            <Timestamp fileName={videoTitle} key={ts.name} title={ts.name} timeInSeconds={ts.time_in_seconds} />
                        ) : <EmptyList />}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

function Timestamp({
    title,
    timeInSeconds,
    fileName
}: {
    title: string;
    timeInSeconds: number;
    fileName: string;
}) {
    const queryClient = new QueryClient();
    const seekMutation = useMutation({
        mutationKey: ['seek'],
        mutationFn: (data: { time: number }) => new Promise((resolve, _) => resolve(data.time))
    })
    const deleteMutation = useMutation({
        mutationKey: ['delete'],
        mutationFn: () => invoke('delete_timestamp', { name: title, fileName: fileName }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timestamps'] })
    })
    return (
        <Button variant='outline' asChild onClick={() => seekMutation.mutate({ time: timeInSeconds })}>
            <Item className="flex flex-row items-center w-full h-16">
                <ItemContent className="flex flex-row justify-between">
                    <ItemTitle>{title}</ItemTitle>
                    <ItemDescription>
                        {new Date(timeInSeconds * 1000).toISOString().slice(11, 19)}
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button onClick={() => deleteMutation.mutate()} variant='destructive' size='sm'>
                        <Trash />
                    </Button>
                </ItemActions>
            </Item>
        </Button>
    );
}

function EmptyList() {
    return (
        <div className="flex w-full flex-col self-center justify-self-center items-center justify-center gap-4 p-8 text-center">
            <p className="text-gray-300 text-nowrap">No timestamps yet</p>
        </div>
    );
}

export default TimestampCard
