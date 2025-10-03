import { useQuery } from "@tanstack/react-query"
import { invoke } from '@tauri-apps/api/core'

export function useGetAllVodsQuery() {
    const query = useQuery({
        queryKey: ['vods'],
        queryFn: () => invoke('get_all_vods')
    })

    return query;
}
