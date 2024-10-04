import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Container, Box, Typography, Button, Checkbox, Select, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'
import { CURRENCIES } from '../../constants/misc'
import { CheckedItemsProps } from '../../App'
import { useDispatch, useSelector } from 'react-redux'
import { setWishList } from '../../state/wishlist/reducer'
import { useStylesList } from '../../hooks/useStylesList'
import { RootState } from '../../state/index'

const buttonStyles = {
  backgroundColor: '#f0f0f0',
  color: '#777777',
  height: '50px',
  width: '100%',
}

const Styles = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  
  const handleNavigate = useCallback(() => {
    navigate('/')
  }, [])

  const { result: stylesList, isLoading, error } = useStylesList()

  // const [isAlreadyExist, setIsAlreadyExist] = useState(false)

  const wishList = useSelector((state: RootState) => state.wishList.items)
  console.log("WISHLIST IN STYLES PAGE", wishList)

  const dispatchWishList = useCallback((indexes: number[]) => {
    console.log("STYLES LISTTTTTT", stylesList)
    const selectedItems = indexes.map((index: number) => stylesList[index])
    console.log("SEL ITESM", selectedItems)
    dispatch(setWishList(selectedItems))
  }, [stylesList])

  const [checkedItemsIndexes, setCheckedItemsIndexes] = useState<number[]>([])

  useEffect(() => {
    const initialCheckedIndexes = wishList.map(item => stylesList.findIndex(style => style.id === item.id))
    console.log("INITIAL CHECKED INDEXES", initialCheckedIndexes)
    setCheckedItemsIndexes(initialCheckedIndexes)
  }, [wishList, stylesList])
  

  const handleClickItem = useCallback((index: number) => {
    console.log("INDEX? ", stylesList[index])

    console.log("INDEX@@@@", index)
    console.log("WISH LSIT@@@@@@", wishList)
    // const isItemExist = wishList.some((item) => item.id === stylesList[index].id)

    // if (isItemExist) {
    //   setIsAlreadyExist(true)
    //   return
    // }

    setCheckedItemsIndexes(prevCheckedItems => {
      if (prevCheckedItems.includes(index)) {
        return prevCheckedItems.filter((item) => item !== index)
      } else {
        return [...prevCheckedItems, index]
      }
    })
  }, [stylesList])

  // const checkedItems: any[] = useMemo(() => {
  //   if (!stylesList || stylesList.length === 0) return []
  //   return []
  // }, [stylesList])

  console.log("CHECKED ITEMS", checkedItemsIndexes)
  console.log("STYLES LIST", stylesList)

  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={{ ...style, padding: '10px 0' }}>
      <Box display="flex" alignItems="center" sx={{ userSelect: 'none', cursor: 'pointer' }} onClick={() => handleClickItem(index)}>
        <Checkbox checked={checkedItemsIndexes.includes(index)} />
        <Box display="flex" flexDirection="column" ml={1}>
          <Typography variant="h6">
            {stylesList[index].name}
          </Typography>
          <Typography variant="h6">
            {stylesList[index].priceToDisplay}
          </Typography>
        </Box>
      </Box>
    </div>
  )

  const getItemSize = useCallback((index: number) => {
    if (stylesList[index] === undefined) return 0
    const item = stylesList[index]
    return item.name.length > 20 ? 100 : 70
  }, [stylesList])
  

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return (
    <Container sx={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <List
        height={700}
        itemCount={stylesList.length}
        itemSize={getItemSize}
        width={650}
      >
        {Row}
      </List>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="caption">서비스를 선택하세요(여러 개 선택 가능)</Typography>
        <Button
            variant="contained"
            sx={{
              backgroundColor: checkedItemsIndexes.length < 3 ? 'gray' : 'primary.main',
              '&:hover': {
                backgroundColor: checkedItemsIndexes.length < 3 ? 'darkgray' : 'primary.dark',
              },
              height: '50px',
              width: '100%',
            }}
            disabled={checkedItemsIndexes.length < 3}
            onClick={() => {
              dispatchWishList(checkedItemsIndexes)
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