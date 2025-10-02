import { Converter } from '@/components/forms';
import { useTwitchScript } from '@/hooks/useTwitchScript';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/convert')({
    component: RouteComponent,
})

function RouteComponent() {
    useTwitchScript()
    return (
        <Converter />
    );

}
