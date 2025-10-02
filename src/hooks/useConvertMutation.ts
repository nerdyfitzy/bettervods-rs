import { useMutation } from '@tanstack/react-query'
import { invoke } from '@tauri-apps/api/core';
import { type UseNavigateResult } from '@tanstack/react-router';

export function useConvertMutation(navigate: UseNavigateResult<'/convert'>) {
    const convertMutation = useMutation({
        mutationKey: ['convert'],
        mutationFn: (data: { m3u8: string, startTime: string, endTime: string, name: string }) => {
            const { m3u8, startTime, endTime, name } = data
            console.log(m3u8, startTime, endTime, name);
            return invoke('convert_from_m3u8', { url: m3u8, startTime, endTime, name })
        },
        onSuccess: () => navigate({ to: '/' }),
        onError: () => console.log('error oopsies')
    })

    return convertMutation;
}
