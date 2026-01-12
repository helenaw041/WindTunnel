import React, { useState, useEffect } from 'react';
import { recentDataState } from "src/states";
import { Grid, Typography, Box, Paper, Button, Chip, Card, CardContent } from '@mui/material';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useStreamStore } from '../hooks/stream_hooks';

// Calculate aggregate statistics
const calculateAggregates = (data: number[]) => {
  if (data.length === 0) return null;
  
  const sorted = [...data].sort((a, b) => a - b);
  
  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / data.length;
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  
  return {
    min: Math.min(...data),
    max: Math.max(...data),
    mean: mean,
    median: sorted[Math.floor(sorted.length / 2)],
    stdDev: Math.sqrt(variance),
    count: data.length,
    latest: data[data.length - 1]
  };
};

// RawGraph component matching your pattern
function RawGraph({data}: {data: number[]}) {
  return (
    <LineChart
      xAxis={[{ data: Array.from({ length: data.length }, (_, index) => index) }]}
      series={[
        {
          data: data,
          label: 'Wind Speed',
          color: '#1976d2',
          showMark: false
        },
      ]}
      height={400}
    />
  );
}

const GraphsTab: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [showAggregate, setShowAggregate] = useState(false);
  
  const aggregates = calculateAggregates(data);
  const latestValue = data.length > 0 ? data[data.length - 1] : 0;

  return (
    <Grid container spacing={3}>
      {/* useStreamStore component - handles data subscription */}
      <useStreamStore channel="wind_speed" data={data} setData={setData}/>
      
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingUp size={32} />
            <Typography variant="h5" fontWeight="bold">
              Wind Speed Monitor
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Current Wind Speed
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {latestValue.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              m/s
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Data Points
            </Typography>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {data.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              samples
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {aggregates && (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Average Speed
                </Typography>
                <Typography variant="h3" color="secondary" fontWeight="bold">
                  {aggregates.mean.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  m/s
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Speed Range
                </Typography>
                <Typography variant="h3" color="warning.main" fontWeight="bold">
                  {(aggregates.max - aggregates.min).toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  m/s
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Aggregate Statistics */}
      {showAggregate && aggregates && (
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChart3 size={24} />
                <Typography variant="h6" fontWeight="bold">
                  Aggregate Statistics
                </Typography>
                <Chip 
                  label={`${data.length} samples`}
                  size="small"
                  color="primary"
                />
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              {[
                { label: 'MINIMUM', value: aggregates.min, color: 'info.main' },
                { label: 'MAXIMUM', value: aggregates.max, color: 'error.main' },
                { label: 'MEAN', value: aggregates.mean, color: 'success.main' },
                { label: 'MEDIAN', value: aggregates.median, color: 'secondary.main' },
                { label: 'STD DEV', value: aggregates.stdDev, color: 'warning.main' },
                { label: 'RANGE', value: aggregates.max - aggregates.min, color: 'text.primary' }
              ].map((stat) => (
                <Grid item xs={6} sm={4} md={2} key={stat.label}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                    <Typography variant="h5" sx={{ color: stat.color }} fontWeight="bold">
                      {stat.value.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">m/s</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      )}

      {/* Main Chart */}
      <Grid item xs={12}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Real-Time Wind Speed Data
            </Typography>
            <Button
              variant={showAggregate ? 'contained' : 'outlined'}
              startIcon={<BarChart3 size={16} />}
              onClick={() => setShowAggregate(!showAggregate)}
            >
              {showAggregate ? 'Hide Stats' : 'Show Stats'}
            </Button>
          </Box>
          
          <Box sx={{ width: '100%', height: 400 }}>
            {data.length > 0 ? (
              <RawGraph data={data} />
            ) : (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Waiting for data...
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GraphsTab