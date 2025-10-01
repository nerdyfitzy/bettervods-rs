import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Video from '@/components/video-card'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data, isLoading } = useQuery({
        queryKey: ['vods'],
        queryFn: () => invoke('get_all_vods')
    })


    return (
        <>
            <section className=' h-full w-full p-8 '>
                <ScrollArea className='h-11/12 '>
                    <div className='w-full flex-row flex flex-wrap gap-y-4 gap-x-8 justify-start items-start'>
                        {isLoading ?
                            <>
                                <Skeleton className='w-1/2 h-5/12 rounded-xl' />
                                <Skeleton className='w-1/2 h-5/12 rounded-xl' />
                            </>
                            /* @ts-ignore */
                            : data.length === 0 ? <EmptyList />
                                : data ?
                                    /* @ts-ignore */
                                    data.map(item => <Video title={new TextDecoder().decode(Uint8Array.from(item.Windows))} />)
                                    : <p>err</p>}
                    </div>
                </ScrollArea>

            </section>
        </>
    )
}

function EmptyList() {
    return (
        <div className="flex w-full flex-col self-center justify-self-center items-center justify-center gap-4 p-8 text-center">
            <p className="text-gray-300">No videos yet?</p>
            <Button variant="outline" asChild>
                <Link to="/convert">Why don&apos;t you add some?</Link>
            </Button>
        </div>
    );
}
