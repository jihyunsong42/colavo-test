
export const formatCurrency = (amount: number, currencyCode: string): string | undefined => {
  return currencyCode === 'KRW' ? amount.toLocaleString('ko-KR') + '원' : 
  currencyCode === 'USD' ? '$' + amount.toLocaleString('en-US') :
  undefined
}