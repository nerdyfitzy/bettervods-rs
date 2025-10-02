import { useMutationState } from '@tanstack/react-query'
import { type MediaPlayerInstance } from '@vidstack/react';
import { useEffect } from 'react';

export function useSeek(timeRef: React.RefObject<MediaPlayerInstance | null>) {
    const variables = useMutationState({
        filters: {
            mutationKey: ['seek'],
            status: 'success'
        },
        select: (mutation) => mutation.state.data
    })

    useEffect(() => {
        const latestTime = variables[variables.length - 1];

        timeRef.current?.remoteControl.seek(latestTime as number);
    }, [variables])
}
