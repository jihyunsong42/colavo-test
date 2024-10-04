import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useCallback, useMemo } from "react"
import { CURRENCIES } from "../constants/misc"
import { useList } from "./useList"

interface StylesListResult {
  result: any[]
  isLoading: boolean
  error: Error | null
}

export const useStylesList = () => {
  const { result: data, error, isLoading } = useList()

  return useMemo<StylesListResult>(() => {
    if (isLoading || error || !data || !data?.items) return { result: [], isLoading, error }

    const result = Object.keys(data.items).map((key) => ({
      id: key,
      ...data.items[key],
      priceToDisplay: 
        data.currency_code === 'KRW' ? data.items[key].price.toLocaleString('ko-KR') + CURRENCIES.KRW : 
        data.currency_code === 'USD' ? CURRENCIES.USD + data.items[key].price.toLocaleString('en-US') :
        data.items[key].price.toLocaleString('ko-KR'),
    }))

    return { result, isLoading, error}

  }, [data, isLoading, error])
  
}

