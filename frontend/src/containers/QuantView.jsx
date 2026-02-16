import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

const QuantView = () => {
    return (
        <Box>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <ConstructionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h4" gutterBottom color="text.secondary">
                    クォント分析
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    現在開発中の機能です。
                </Typography>
                <Chip 
                    label="Coming Soon" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 2 }}
                />
            </Paper>
        </Box>
    );
};

export default QuantView;
