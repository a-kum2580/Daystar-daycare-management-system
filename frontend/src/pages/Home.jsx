import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  ContactMail as ContactIcon,
  Login as LoginIcon,
  ChildCare as ChildCareIcon,
  EmojiObjects as EmojiObjectsIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  const features = [
    {
      icon: <ChildCareIcon fontSize="large" />,
      title: 'Experienced Caregivers',
      description: 'Our staff has over 50 years of combined experience in early childhood education.',
    },
    {
      icon: <EmojiObjectsIcon fontSize="large" />,
      title: 'Educational Programs',
      description: 'Age-appropriate curriculum designed to stimulate learning and development.',
    },
    {
      icon: <FavoriteIcon fontSize="large" />,
      title: 'Nurturing Environment',
      description: 'Safe, clean, and loving atmosphere where children can thrive and grow.',
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Safety First',
      description: '24/7 security monitoring and strict safety protocols for your peace of mind.',
    },
    {
      icon: <AccessTimeIcon fontSize="large" />,
      title: 'Flexible Hours',
      description: 'Extended hours to accommodate working parents with convenient drop-off and pick-up.',
    },
    {
      icon: <LocationIcon fontSize="large" />,
      title: 'Convenient Location',
      description: 'Easy access with ample parking and close to major transportation routes.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent of Emma (3)',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      text: 'Daystar has been an absolute blessing for our family. Emma has blossomed since starting here. The teachers are caring and attentive, and the educational programs are outstanding.',
    },
    {
      name: 'Michael Chen',
      role: 'Parent of Liam (4)',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      text: 'As a working parent, finding reliable childcare was crucial. Daystar has exceeded our expectations with their professional staff, engaging activities, and regular updates on Liam\'s progress.',
    },
    {
      name: 'Aisha Patel',
      role: 'Parent of Zara (2)',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      text: 'The attention to detail in their programs and the genuine care for each child is evident. Zara looks forward to going to daycare every morning, which says everything about how wonderful Daystar is.',
    },
  ];

  const programs = [
    {
      title: 'Infant Care (0-18 months)',
      description: 'Nurturing care in a safe, stimulating environment with a focus on sensory development and attachment.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      title: 'Toddler Program (18-36 months)',
      description: 'Structured activities that promote language development, motor skills, and social interaction.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      title: 'Preschool (3-5 years)',
      description: 'Comprehensive curriculum preparing children for kindergarten with focus on literacy, math, and social skills.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      title: 'Before & After School Care',
      description: 'Safe, engaging environment for school-age children with homework help and recreational activities.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
          >
            <ChildCareIcon sx={{ mr: 1 }} />
            Daystar Daycare
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            <Button color="inherit" startIcon={<HomeIcon />}>
              Home
            </Button>
            <Button color="inherit" startIcon={<SchoolIcon />}>
              Programs
            </Button>
            <Button color="inherit" startIcon={<PeopleIcon />}>
              About Us
            </Button>
            <Button color="inherit" startIcon={<ContactIcon />}>
              Contact
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Programs" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="About Us" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ContactIcon />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => navigate('/login')}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary={isAuthenticated ? 'Dashboard' : 'Login'} />
          </ListItem>
        </List>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    Nurturing Minds, Growing Futures
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                    Where learning meets love, and every child's potential is celebrated.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      sx={{ py: 1.5, px: 4, borderRadius: 2 }}
                    >
                      Schedule a Tour
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      sx={{ py: 1.5, px: 4, borderRadius: 2 }}
                    >
                      Learn More
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1500}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Happy children playing"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: 6,
                    transform: 'rotate(-2deg)',
                  }}
                />
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ mb: 6, fontWeight: 'bold', color: 'primary.main' }}
        >
          Why Choose Daystar Daycare?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                        color: 'primary.main',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Programs Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ mb: 6, fontWeight: 'bold', color: 'primary.main' }}
          >
            Our Programs
          </Typography>
          <Grid container spacing={4}>
            {programs.map((program, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={program.image}
                      alt={program.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                        {program.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {program.description}
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        sx={{ mt: 2 }}
                        endIcon={<SendIcon />}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ mb: 6, fontWeight: 'bold', color: 'primary.main' }}
        >
          What Parents Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 4,
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                      borderRadius: '4px 4px 0 0',
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, fontStyle: 'italic', flexGrow: 1 }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={testimonial.image}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Ready to Enroll Your Child?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Join our waiting list today and secure your child's spot in our nurturing environment.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ py: 1.5, px: 4, borderRadius: 2 }}
              >
                Join Waiting List
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Happy child"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: 6,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
            color: 'white',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Stay Connected
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                Subscribe to our newsletter for updates, parenting tips, and special events.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box component="form" onSubmit={handleEmailSubmit}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'transparent',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ borderRadius: 2 }}
                        >
                          Subscribe
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
          py: 6,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Daystar Daycare
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Nurturing minds, growing futures. Providing quality childcare and early education since 2010.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="inherit" size="small">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="inherit" size="small">
                  <TwitterIcon />
                </IconButton>
                <IconButton color="inherit" size="small">
                  <InstagramIcon />
                </IconButton>
                <IconButton color="inherit" size="small">
                  <YouTubeIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                    Home
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                    Programs
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                    About Us
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                    Contact
                  </Button>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Programs
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                    Infant Care
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                    Toddler Program
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                    Preschool
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                    Before & After School
                  </Button>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact Us
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    123 Daycare Lane, Anytown, ST 12345
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <PhoneIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">(555) 123-4567</Typography>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <EmailIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">info@daystardaycare.com</Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Daystar Daycare. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 