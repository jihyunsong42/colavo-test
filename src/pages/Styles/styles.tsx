import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Box, Typography, Button, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { VariableSizeList as List, ListChildComponentProps } from 'react-window';
import { CURRENCIES } from '../../constants/misc';

const buttonStyles = {
  backgroundColor: '#f0f0f0',
  color: '#777777',
  height: '50px',
  width: '100%',
}

const Styles = () => {

  const [checkedItems, setCheckedItems] = useState<any[]>([])

  console.log("CHECKED ITEMS", checkedItems)

  const fetchStylesList = useCallback(async () => {
    const { data } = await axios.post('https://us-central1-colavolab.cloudfunctions.net/requestAssignmentCalculatorData')
    return data;
  }, [])

  const { data, error, isLoading } = useQuery({
    queryKey: ['styles'],
    queryFn: fetchStylesList,
  })

  const stylesList = useMemo(() => {
    if (isLoading || error || !data || !data?.items) return []

    const itemArr = Object.keys(data.items).map((key) => ({
      id: key,
      ...data.items[key],
      price: 
        data.currency_code === 'KRW' ? data.items[key].price.toLocaleString('ko-KR') + CURRENCIES.KRW : 
        data.currency_code === 'USD' ? CURRENCIES.USD + data.items[key].price.toLocaleString('en-US') :
        data.items[key].price.toLocaleString('ko-KR'),
    }));

    // setCheckedItems(Array(itemArr.length).fill(false))

    return itemArr;

  }, [data, isLoading, error])


  useEffect(() => {
    console.log("CHECKED ITEMS ", checkedItems)
  }, [checkedItems])

  const handleClickItem = useCallback((index: number) => {
    console.log("INDEX? ", index)
    setCheckedItems(prevCheckedItems => {
      if (prevCheckedItems.includes(index)) {
        return prevCheckedItems.filter((item) => item !== index)
      } else {
        return [...prevCheckedItems, index]
      }
    })
  }, [stylesList])

  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={{ ...style, padding: '10px 0' }}>
      <Box display="flex" alignItems="center" sx={{ userSelect: 'none', cursor: 'pointer' }} onClick={() => handleClickItem(index)}>
        <Checkbox checked={checkedItems[index]} />
        <Box display="flex" flexDirection="column" ml={1}>
          <Typography
            variant="h6"
          >
            {stylesList[index].name}
          </Typography>
          <Typography
            variant="h6"
          >
            {stylesList[index].price}
          </Typography>        
        </Box>
      </Box>
    </div>
  );

  const getItemSize = useCallback((index: number) => {
    if (stylesList[index] === undefined) return 0;
    const item = stylesList[index];
    return item.name.length > 20 ? 100 : 70;
  }, [stylesList]);
  

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
            sx={buttonStyles}
          >
          완료
          </Button>
      </Box>
    </Container>
  );
};

export default Styles;