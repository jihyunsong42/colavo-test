import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useCallback, useMemo } from "react"

export const useList = () => {
  
  const fetchList = useCallback(async () => {
    const { data } = await axios.post('https://us-central1-colavolab.cloudfunctions.net/requestAssignmentCalculatorData')
    return data
  }, [])
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['styles'],
    queryFn: fetchList,
  })

  return useMemo(() => {
    if (isLoading || error || !data || !data?.items) return { result: [], isLoading, error }

    return { result: data, isLoading, error}

  }, [data, isLoading, error])

}

