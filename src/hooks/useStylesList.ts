import { useMemo } from "react"
import { useList } from "./useList"

interface StylesListResult {
  result: any[]
  isLoading: boolean
  error: Error | null
}

export const useStylesList = () => { // 시술 리스트 커스텀 훅
  const { result: data, error, isLoading } = useList()

  return useMemo<StylesListResult>(() => {
    if (isLoading || error || !data || !data?.items) return { result: [], isLoading, error }

    const result = Object.keys(data.items).map((key) => ({
      id: key,
      ...data.items[key],
      currencyCode: data.currency_code
    }))

    return { result, isLoading, error}

  }, [data, isLoading, error])
  
}

