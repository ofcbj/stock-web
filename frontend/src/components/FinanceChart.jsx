import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box, Typography, Paper, Grid } from '@mui/material';

const FinanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography variant="h6" color="text.secondary">
          チャートデータがありません。
        </Typography>
      </Box>
    );
  }

  const chartData = data.map(item => ({
    year: item.year,
    revenue: item.revenue || 0,
    capital: item.capital || 0,
    profit: item.profit || 0,
    earning: item.earning || 0
  }));

  const formatNumber = (value) => {
    if (value === null || value === undefined) return 0;
    return new Intl.NumberFormat('ja-JP').format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}年
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" color={entry.color}>
              {entry.name}: {formatNumber(entry.value)}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const charts = [
    {
      title: '売上',
      dataKey: 'revenue',
      color: '#1976d2'
    },
    {
      title: '資本',
      dataKey: 'capital',
      color: '#dc004e'
    },
    {
      title: '営業利益',
      dataKey: 'profit',
      color: '#2e7d32'
    },
    {
      title: '純利益',
      dataKey: 'earning',
      color: '#ed6c02'
    }
  ];

  return (
    <Grid container spacing={2}>
      {charts.map((chart, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" align="center" gutterBottom>
              {chart.title}
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatNumber}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey={chart.dataKey} 
                  fill={chart.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default FinanceChart;
