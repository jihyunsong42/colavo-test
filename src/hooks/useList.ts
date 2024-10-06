import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useCallback, useMemo } from "react"

export const useList = () => { // 데이터 페칭 커스텀 훅
  const fetchList = useCallback(async () => {
    const { data } = await axios.post('https://us-central1-colavolab.cloudfunctions.net/requestAssignmentCalculatorData')
    return data
  }, [])
  
  const keys = useMemo(() => {
    return ['list']
  }, [])

  const { data, error, isLoading } = useQuery({
    queryKey: keys,
    queryFn: fetchList,
    enabled: true,
    staleTime: 10 * 1000,
    refetchInterval: 60 * 1000
  })

  return useMemo(() => {
    if (isLoading || error || !data || !data?.items) return { result: [], isLoading, error }

    return { result: data, isLoading, error}

  }, [data, isLoading, error])

}

