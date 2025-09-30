import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

function Video({ title }: { title: string; id?: number }) {
    return (
        <Link to='/convert'>
            <Card className="relative min-h-fit border-2 bg-card p-8 shadow-md drop-shadow-xl hover:bg-slate-800">
                <CardContent className="flex flex-col gap-4">
                    <img
                        className="rounded-md"
                        alt="Thumbnail"
                        width={1280}
                        height={720}
                        src="../../public/bkmeal.png"
                    />
                    <div className="flex flex-row justify-start">
                        <p className="text-lg font-bold">{title}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default Video;
