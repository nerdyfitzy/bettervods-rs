import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { useMutation, useMutationState } from "@tanstack/react-query";
import { TimestampForm } from "./forms";
import { ScrollArea } from "./ui/scroll-area";
import React, { useEffect, useState } from "react";
import { MediaPlayerInstance } from "@vidstack/react";
import { z } from 'zod'
import { Plus } from "lucide-react";
import { timestampSchema } from "@/lib/schema";


function TimestampCard({ videoTitle, timeRef, initTimestamps }: { initTimestamps: z.infer<typeof timestampSchema>; videoTitle: string; timeRef: React.RefObject<MediaPlayerInstance | null> }) {
    const variables = useMutationState({
        filters: {
            mutationKey: ['add_timestamp']
        },
        select: (mutation) => mutation.state.variables
    })


    const [timestamps, setTimestamps] = useState<z.infer<typeof timestampSchema>>(initTimestamps)

    useEffect(() => {
        if (variables.length > 0) {
            //@ts-ignore
            setTimestamps([variables[variables.length - 1], ...timestamps].sort((a, b) => a - b))
        }
    }, [variables])

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
                        {timestamps?.length > 0 ? timestamps.map(ts =>
                            <Timestamp key={ts.name} title={ts.name} timeInSeconds={ts.time_in_seconds} />
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
}: {
    title: string;
    timeInSeconds: number;
}) {
    const mutation = useMutation({
        mutationKey: ['seek'],
        mutationFn: (data: { time: number }) => new Promise((resolve, _) => resolve(data.time))
    })
    return (
        <Button asChild onClick={() => mutation.mutate({ time: timeInSeconds })}>
            <Card
                className="flex w-full border-slate-400 border-1 drop-shadow-xl rounded-xs flex-row items-center justify-between "
            >
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardContent className="text-white text-xs">
                    {/* one liner for hh:mm:ss */}
                    {new Date(timeInSeconds * 1000).toISOString().slice(11, 19)}
                </CardContent>
            </Card>
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
