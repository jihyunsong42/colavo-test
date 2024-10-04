import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Container, Box, Typography, Button, Select, MenuItem, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CheckedItemsProps } from '../../App'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../state/index'
import CloseIcon from '@mui/icons-material/Close';
import { setWishList } from '../../state/wishlist/reducer'

const buttonStyles = {
  backgroundColor: '#f0f0f0',
  color: '#777777',
  height: '50px',
  width: '100%',
}

const WishList = () => {

  const wishList = useSelector((state: RootState) => state.wishList.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleNavigate = useCallback((index: number) => {
    index === 0 ? navigate('/styles') :
    index === 1 ? navigate('/discounts') :
    navigate('/')
    // navigate('/styles')
  }, [])

  const [selectedCounts, setSelectedCounts] = useState(wishList.map((item) => item.count))

  const handleCountChange = useCallback((e: any, index: number) => {
    console.log("E TAR VAL", e.target.value)
    console.log("INDEX", index)
    // setSelectedCounts(e.target.value)
    setSelectedCounts((prev) => {
      console.log("PREV", prev)
      const newCounts = [...prev]
      newCounts[index] = e.target.value
      return newCounts
    })
  }, [])

  const handleDeleteItem = useCallback((index: number) => {
    console.log("ITEM INDEXD TO DELETE", index)
    console.log("WISHLIST", wishList)
    const newWishList = wishList.filter((item, i) => i !== index)
    console.log("NEEW  WIISH LIST", newWishList)
    dispatch(setWishList(newWishList))
    setSelectedCounts((prev) => {
      const newCounts = prev.filter((count, i) => i !== index)
      return newCounts
    })
  }, [])
  
  useEffect(() => {
    const res = wishList.map((item) => item.count)
    console.log("RES", res)
    // setSelectedCounts()
  }, [wishList])
  // const selectedCounts = useMemo(() => {
  //   return wishList.map((item) => item.count)
  //   // return selectedCounts
  // }, [wishList])

  console.log("SELECTED COUTNS", selectedCounts)

  const getItemSize = useCallback((index: number) => {
    console.log("CHECKED ITEM###S", wishList[index])
    if (wishList[index] === undefined) return 0
    const item = wishList[index]
    return 70
  }, [wishList])

  const countSize = 99

  const counts = Array.from({ length: countSize }, (_, index) => index + 1)
  
  const Row = ({ data, index, style }: ListChildComponentProps) => {
    const item = data[index]
    console.log("ROW INDEX", index)
    return (
    <div style={{ ...style, padding: '10px 0' }}>
      <Box display="flex" alignItems="center" sx={{ userSelect: 'none', cursor: 'pointer' }}>
        <Box display="flex" flexDirection="column" ml={1} flexGrow={1}>
          <Typography
            variant="h6"
          >
            {item.name}
          </Typography>
          <Typography
            variant="h6"
          >
            {item.priceToDisplay}
          </Typography>
        </Box>
        <Select
          value={selectedCounts[index]}
          onChange={(e: any) => handleCountChange(e, index)}
          displayEmpty
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
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>10</MenuItem> */}
        </Select>

        <IconButton onClick={() => handleDeleteItem(index)} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
    </div>
    )
  }

  const totalPrice = useMemo(() => {
    return wishList.reduce((acc, item, index) => acc + (item.price * selectedCounts[index]), 0)
  }, [wishList, selectedCounts])

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
          합계 {totalPrice}원
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