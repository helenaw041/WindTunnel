import React, { useState } from 'react';
import { Typography, Box, Paper, Grid, Button, Slider} from '@mui/material';
import { Send, Zap, TrendingUp, SlidersHorizontal } from 'lucide-react';
import StatusCard from '..//components/StatusCard';

function ManualControlTab()
{
    const [targetSpeed, setTargetSpeed] = useState<number>(0);
    const [tunnelPower, setTunnelPower] = useState<boolean>(false);

  const handlePowerToggle = () => {
    setTunnelPower(prev => !prev);
  };

  // NOTE: Swapped alert() with console.log() as alert() is forbidden.
  const handleSendCommands = () => {
    // fetch()
    // In a real application, you would send these commands to the control system API
  };

  return (<Grid container spacing={4}>
    <Paper elevation={3} className="p-6 bg-white shadow-xl rounded-lg">
        
      <Box className="flex items-center space-x-3 mb-6">
        <SlidersHorizontal className="text-red-500" size={24} />
        <Typography variant="h5" className="font-semibold text-gray-700">
          Manual Override & Control
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {/* Speed Control */}
        <Grid item xs={12} md={6}>
          <Box className="p-4 border rounded-lg">
            <Typography variant="subtitle1" className="font-medium mb-4 flex items-center"><TrendingUp className="mr-2" size={18} /> Target Air Speed (m/s)</Typography>
            <Slider
              value={targetSpeed}
              onChange={(_e, newValue) => setTargetSpeed(newValue as number)}
              aria-labelledby="input-slider"
              //valueLabelDisplay="on"
              min={0}
              max={13}
              step={0.5}
              color="primary"
            />
            <Typography variant="h4" className="text-center mt-2 text-blue-600">{targetSpeed} m/s</Typography>
          </Box>
        </Grid>

        {/* Power Control and Command Send */}
        <Grid item xs={12} className="flex justify-center">
          <Box className="flex items-center space-x-6 p-6 border-t mt-4 w-full justify-center">
            <Button
              variant="contained"
              color={tunnelPower ? 'error' : 'success'}
              startIcon={<Zap />}
              onClick={handlePowerToggle}
              size="large"
              className={`min-w-[150px] ${tunnelPower ? 'animate-pulse' : ''}`}
            >
              {tunnelPower ? 'SHUTDOWN' : 'POWER ON'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Send />}
              onClick={handleSendCommands}
              disabled={!tunnelPower}
              size="large"
              className="min-w-[150px]"
            >
              Apply Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        Warning: Manual control overrides all running test profiles. Use with caution.
      </Box>
    </Paper>
    <StatusCard/>
    </Grid>
  );
}

export default ManualControlTab