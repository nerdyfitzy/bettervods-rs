import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useFullPathQuery(title: string) {
    const query = useQuery({
        queryKey: ['full_path', title],
        queryFn: () => invoke('get_full_path', { name: title })
    })

    return query;
}
