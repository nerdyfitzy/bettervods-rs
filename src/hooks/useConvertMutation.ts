import { useMutation } from '@tanstack/react-query'
import { invoke } from '@tauri-apps/api/core';
import { type UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';

export function useConvertMutation(navigate: UseNavigateResult<'/convert'>) {
    const convertMutation = useMutation({
        mutationKey: ['convert'],
        mutationFn: (data: { m3u8: string, startTime: string, endTime: string, name: string }) => {
            const { m3u8, startTime, endTime, name } = data
            return invoke('convert_from_m3u8', { url: m3u8, startTime, endTime, name })
        },
        onSuccess: () => {
            toast('VOD has been downloaded')
            navigate({ to: '/' })
        },
        onError: () => console.log('error oopsies')
    })

    return convertMutation;
}
