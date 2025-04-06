import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Chat = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography variant="h6" gutterBottom>
          Chat Messages
        </Typography>
        {/* Chat interface will be implemented here */}
        <Typography color="text.secondary">
          Chat functionality coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Chat; 