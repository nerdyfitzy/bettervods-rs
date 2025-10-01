import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";

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
                className="flex w-full rounded-xs flex-row items-center justify-between px-4 py-2 hover:bg-slate-700 active:bg-slate-800"
            >
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>
                    {/* one liner for hh:mm:ss */}
                    {new Date(timeInSeconds * 1000).toISOString().slice(11, 19)}
                </CardDescription>
            </Card>
        </Button>
    );
}

export default Timestamp
