import { useMutationState } from "@tanstack/react-query";

export function useM3u8State(): unknown[] {
    const variables = useMutationState({
        filters: {
            mutationKey: ['m3u8'],
            status: 'success'
        },
        select: (mutation) => mutation.state.data
    })

    return variables;
} 
