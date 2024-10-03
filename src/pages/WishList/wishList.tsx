import React, { useCallback } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const buttonStyles = {
  backgroundColor: '#f0f0f0',
  color: '#777777',
  height: '50px',
  width: '100%',
}



const WishList = () => {
  const navigate = useNavigate();
  
  const handleNavigate = useCallback(() => {
    navigate('/styles');
  }, []);

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
          <Button onClick={handleNavigate}
            variant="contained"
            sx={buttonStyles}
          >
          시술
          </Button>
          <Button
            variant="contained"
            sx={buttonStyles}
          >
          할인
          </Button>
        </Box>
        
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
          <Button 
            variant="contained"
            sx={buttonStyles}
          >
          다음
          </Button>
      </Box>
    </Container>
  );
};

export default WishList;