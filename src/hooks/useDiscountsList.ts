import { useMemo } from "react"
import { useList } from "./useList"

interface DiscountsListResult {
  result: any[]
  isLoading: boolean
  error: Error | null
}

export const useDiscountsList = () => { // 할인 리스트 커스텀 훅
  const { result: data, error, isLoading } = useList()

  return useMemo<DiscountsListResult>(() => {
    if (isLoading || error || !data || !data?.discounts) return { result: [], isLoading, error }

    const result = Object.keys(data.discounts).map((key) => ({
      id: key,
      ...data.discounts[key],
      currencyCode: data.currency_code
    }))

    return { result, isLoading, error}

  }, [data, isLoading, error])
  
}

