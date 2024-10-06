import { useCallback, useEffect, useState } from 'react'
import { Container, Box, Typography, Button, Checkbox } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'
import { useDispatch, useSelector } from 'react-redux'
import { setWishList } from '../../state/wishlist/reducer'
import { RootState } from '../../state/index'
import { WishListItem } from '../../state/wishlist/reducer'
import { useDiscountsList } from '../../hooks/useDiscountsList'

const Styles = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const handleNavigate = useCallback(() => {
    navigate('/')
  }, [])

  const { result: discountsList, isLoading, error } = useDiscountsList() // 할인 리스트 가져오기

  const wishList = useSelector((state: RootState) => state.wishList.items)
  const discountsWishList = wishList.filter((item: WishListItem) => item.type === 'discount')
  const stylesWishList = wishList.filter((item: WishListItem) => item.type === 'style')
  
  const [checkedIds, setCheckedIds] = useState<string[]>([])

  const dispatchWishList = useCallback((ids: string[]) => { // 다음 버튼 클릭시 redux에 wishList 저장
    const addedItems = ids
    .map((id: string) => discountsList.find((style: any) => style.id === id))
    .filter((item: any) => !discountsWishList.some(wishItem => wishItem.id === item.id))

    const deletedItems = discountsWishList.filter((item) => !ids.includes(item.id))
    
    const newDiscountsWishList: WishListItem[] = discountsWishList
    .filter((item: WishListItem) => !deletedItems.some((deletedItem) => deletedItem.id === item.id))
    .concat(addedItems)
    .map((item: WishListItem) => ({ ...item, type: 'discount' }))

    const newWishList = stylesWishList.concat(newDiscountsWishList)

    dispatch(setWishList(newWishList))

  }, [discountsList, wishList, checkedIds])

  useEffect(() => { // checkedIds 초기화
    const initialCheckedIds = discountsWishList.map(item => item.id)
    setCheckedIds(initialCheckedIds)
  }, [wishList, discountsList])

  const handleClickItem = useCallback((data: any) => { // 아이템 클릭시 checkedIds 업데이트
    setCheckedIds(prevCheckedIds => {
      if (prevCheckedIds.includes(data.id)) {
        return prevCheckedIds.filter((id) => id !== data.id)
      } else {
        return [...prevCheckedIds, data.id]
      }
    })
  }, [discountsList])

  const Row = ({ data, index, style }: ListChildComponentProps) => {
    if (!data || index < 0 || index >= data.length) return null
    
    const item = data[index]
    return (
      <div style={{ ...style, padding: '10px 0' }}>
        <Box display="flex" alignItems="center" sx={{ userSelect: 'none', cursor: 'pointer' }} onClick={() => handleClickItem(data[index])}>
          <Checkbox checked={checkedIds.includes(item.id)} />
          <Box display="flex" flexDirection="column" ml={1}>
            <Typography variant="h6">
              {discountsList[index].name}
            </Typography>
            <Typography variant="h6">
              {Math.round(discountsList[index].rate * 100)} %
            </Typography>
          </Box>
        </Box>
      </div>
    )
  }

  const getItemSize = useCallback((index: number) => {  // 아이템 높이
    if (discountsList[index] === undefined) return 0
    const item = discountsList[index]
    return item.name.length > 20 ? 100 : 70
  }, [discountsList])
  

  if (isLoading) return <h2>Loading...</h2>
  if (error) return <h2>Error fetching data</h2>

  return (
    <Container sx={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <List
        height={700}
        itemCount={discountsList.length}
        itemSize={getItemSize}
        itemData={discountsList}
        width={650}
      >
        {Row}
      </List>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="caption">서비스를 선택하세요(여러 개 선택 가능)</Typography>
        <Button
            variant="contained"
            sx={{
              backgroundColor: checkedIds.length < 3 ? 'gray' : 'primary.main',
              '&:hover': {
                backgroundColor: checkedIds.length < 3 ? 'darkgray' : 'primary.dark',
              },
              height: '50px',
              width: '100%',
            }}
            disabled={checkedIds.length < 3}
            onClick={() => {
              dispatchWishList(checkedIds)
              handleNavigate()
            }}
          >
          완료
        </Button>
      </Box>
    </Container>
  )
}

export default Styles