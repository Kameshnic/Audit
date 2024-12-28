import React from 'react';
import { Container, Typography, Button, Box, AppBar, Toolbar, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundImage: `url('https://png.pngtree.com/background/20211215/original/pngtree-modern-simple-elegant-dark-blue-landing-page-website-background-picture-image_1454711.jpg')`, // Replace with your image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(8, 2),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  color: '#fff',
  position: 'absolute',
  top: 65,
  left: 0,
  width: '100%',
  height: '230px'
}));

const Home = () => {
    const nav = useNavigate();

    const handleReg = () => {
        nav('/register');
    }

    const handleLog = () => {
        nav('/login');
    }

    return (
    <>
        <AppBar position="fixed" sx={{top:0,left:0,right:0}}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Audit
            </Typography>
            <IconButton color="inherit" sx={{ marginRight: 2 }} onClick={handleReg}>
            <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleLog}>
            <LoginIcon />
            </IconButton>
        </Toolbar>
        </AppBar>

        <Container maxWidth="md" style={{ marginTop: '50px'}}>
        <ContentBox>
            <Typography variant="h3" gutterBottom>
            Welcome to Audit Web
            </Typography>
            <Typography variant="body1" paragraph>
            Login and Register for upcoming events
            </Typography>
            <Box mt={3}>
            <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
                Learn More
            </Button>
            <Button variant="outlined" color="secondary">
                Contact Us
            </Button>
            </Box>
        </ContentBox>
        <Container>
            <Typography sx={{height:'1000px',marginTop:50}}>
                info
            </Typography>
        </Container>
        <Container>
            Footer
        </Container>
        </Container>
    </>
    );
};

export default Home;
