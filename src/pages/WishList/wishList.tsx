import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Container, Box, Typography, Button, Select, MenuItem, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../state/index'
import CloseIcon from '@mui/icons-material/Close';
import { setWishList, WishListItem } from '../../state/wishlist/reducer'
import { formatCurrency } from '../../utils/currencies'

const buttonStyles = {
  backgroundColor: '#f0f0f0',
  color: '#777777',
  height: '50px',
  width: '100%',
}

const WishList = () => {

  const wishList = useSelector((state: RootState) => state.wishList.items)
  const stylesWishList = wishList.filter((item: WishListItem) => item.type === 'style')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const discountsWishList = useMemo(() => {
    const discountsList = wishList.filter((item: WishListItem) => item.type === 'discount')
    const updatedDiscountsList = discountsList.map((discountItem: WishListItem) => {
      const rate = discountItem.rate ?? 0
      if (discountItem.target === 'none' || discountItem.target === undefined) {
        return { 
          ...discountItem, 
          discountedPrice: stylesWishList.reduce((acc, styleItem) => 
            acc + 
          (Math.round(styleItem.price && styleItem.count ? styleItem.price * styleItem.count * rate : 0)), 0)
        }
      } else {
        const targetItem = stylesWishList.find((styleItem) => styleItem.id === discountItem.target)
        return {
          ...discountItem,
          discountedPrice: targetItem?.price && targetItem.count ? Math.round(targetItem.price * targetItem.count * rate) : 0
        }
      }
    })
    return updatedDiscountsList
  }, [wishList, stylesWishList])

  useEffect(() => {
    const updatedWishList = stylesWishList.concat(discountsWishList)
    if (JSON.stringify(updatedWishList) !== JSON.stringify(wishList)) 
      dispatch(setWishList(updatedWishList))
  }, [dispatch, stylesWishList, discountsWishList])

  const handleNavigate = useCallback((index: number) => {
    index === 0 ? navigate('/styles') :
    index === 1 ? navigate('/discounts') :
    navigate('/')
  }, [])

  const handleCountChange = useCallback((e: any, index: number) => {
    const newWishList = wishList.map((item: WishListItem, i: number) => 
      i === index ? { ...item, count: e.target.value } : item
    )
    dispatch(setWishList(newWishList))
  }, [wishList])

  const handleDiscountTargetChange = useCallback((e: any, index: number) => {
    const newWishList = wishList.map((item: WishListItem, i: number) => {
      return i === index ? { ...item, target: e.target.value } : item
    })
    dispatch(setWishList(newWishList))
  }, [wishList])


  const handleDeleteItem = useCallback((index: number) => {
    const newWishList = wishList.filter((item: WishListItem, i: number) => i !== index)
    dispatch(setWishList(newWishList))
  }, [wishList])

  const getItemSize = useCallback((index: number) => {
    if (wishList[index] === undefined) return 0
    const item = wishList[index]
    console.log("ITEMEEE", item)
    const targetName = wishList.find((wishListItem: WishListItem) => wishListItem.target === item.id)
    console.log("TARGETNAME:", targetName?.name)
    return item.name.length > 20 ? 100 : 70
  }, [wishList])

  
  const countSize = 99

  const counts = Array.from({ length: countSize }, (_, index) => index + 1)

  const targets = [
    { label: '선택 안함(전체)', value: 'none' },
    ...stylesWishList.map((item: WishListItem) => ({
      label: `${item.name} X ${item.count}`,
      value: item.id
    }))
  ]

  const Row = ({ data, index, style }: ListChildComponentProps) => {
    const item = data[index]
    return (
    <div style={{ ...style, padding: '10px 0' }}>
      <Box display="flex" alignItems="center" sx={{ userSelect: 'none', cursor: 'pointer' }}>
        <Box display="flex" flexDirection="column" ml={1} flexGrow={1}>
          <Typography
            variant="h6"
          >
            {item.name + (item.type === 'discount' ? ` (${Math.round(item.rate * 100)}%)` : '')}
          </Typography>
          <Typography
            variant="h6"
          >
          {item.type === 'style' 
            ? formatCurrency((item.price * item.count), item.currencyCode) 
            : `-${item.discountedPrice !== undefined ? formatCurrency(item.discountedPrice, item.currencyCode) : 0}`
          }
          </Typography>
        </Box>
        {item.type === 'style' && (
          <Select
            value={item?.count}
            onChange={(e: any) => handleCountChange(e, index)}
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{ minWidth: '70px', height: '40px', ml: 2 }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                }
              }
            }}
          >
          {counts.map((count) => (
            <MenuItem key={count} value={count}>
              {count}
            </MenuItem>
          ))}
          </Select>
        )}
        {item.type === 'discount' && (
          <Select
          value={item?.target ?? 'none'}
          onChange={(e: any) => handleDiscountTargetChange(e, index)}
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{ minWidth: '140px', height: '40px', ml: 2 }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              }
            }
          }}
        >
          {targets.map((target) => (
            <MenuItem key={target.value} value={target.value}>
              {target.label}
            </MenuItem>
          ))}
        </Select>
        )}
        <IconButton onClick={() => handleDeleteItem(index)} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
    </div>
    )
  }

  return (
    <Container sx={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2,
        }}
      >
        <Typography variant="h6">고객명</Typography>
        <Typography variant="body1" sx={{ color: '#777777' }}>2024.10.03 오후 3:40</Typography>
        <Box display="flex" flexDirection="row" gap={2} mt={2} width="100%">
          <Button onClick={() => handleNavigate(0)}
            variant="contained"
            sx={buttonStyles}
          >
          시술
          </Button>
          <Button onClick={() => handleNavigate(1)}
            variant="contained"
            sx={buttonStyles}
          >
          할인
          </Button>
        </Box>
      </Box>
      <Box sx={{ flex: 1, mt: '150px'}}>
        <List 
          height={700}
          itemCount={wishList?.length}
          itemSize={getItemSize}
          itemData={wishList}
          width={650}
        >
          {Row}
        </List>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography>
          합계 {
            wishList.length > 0
            ? formatCurrency(
              wishList.reduce((acc, item) => {
                return acc + (item.price ?? 0) * (item.count ?? 0)
              }, 0)
              - wishList.reduce((acc, item) => {
                return acc + (item.discountedPrice ?? 0)
              }, 0)
              , wishList[0].currencyCode
            )
            : 0
          }
        </Typography>
          <Button 
            variant="contained"
            sx={buttonStyles}
          >
          다음
          </Button>
      </Box>
    </Container>
  )
}

export default WishList