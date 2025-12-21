import React, { useState } from 'react';
import { Typography, Box, Paper, Grid, Button, Slider, ToggleButton, ToggleButtonGroup, Switch, FormControlLabel } from '@mui/material';
import { Send, Zap, TrendingUp, SlidersHorizontal } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import { useStreamTop } from '../hooks/stream_hooks';
import { tunnelPowerState } from '../states';

function ManualControlTab() {
  const [targetSpeed, setTargetSpeed] = useState(0);
  const [tunnelPower, setTunnelPower] = tunnelPowerState.useState();  // ✅ Use the global state
  const [unit, setUnit] = useState('ms');

  const handlePowerToggle = () => {
    setTunnelPower(prev => !prev);
  };

  const handleSendCommands = () => {
    console.log('Sending commands:', { targetSpeed, tunnelPower });
  };

  const handleUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      setUnit(newUnit);
    }
  };

  const speedMph = (targetSpeed * 2.23694).toFixed(1);
  const displaySpeed = unit === 'ms' ? targetSpeed : speedMph;
  const displayUnit = unit === 'ms' ? 'm/s' : 'mph';

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3 }}>
          
          {/* Header with Status Indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SlidersHorizontal className="text-red-500" size={24} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Manual Override & Control
              </Typography>
            </Box>
          </Box>

          {/* Speed Control with Unit Toggle */}
          <Box sx={{ maxWidth: 700, mx: 'auto', p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp size={18} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Target Air Speed
                </Typography>
              </Box>
              
              {/* Unit Toggle */}
              <ToggleButtonGroup
                value={unit}
                exclusive
                onChange={handleUnitChange}
                aria-label="speed unit"
                size="small"
              >
                <ToggleButton value="ms" aria-label="meters per second">
                  m/s
                </ToggleButton>
                <ToggleButton value="mph" aria-label="miles per hour">
                  mph
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            <Slider
              value={targetSpeed}
              onChange={(e, newValue) => setTargetSpeed(newValue)}
              aria-labelledby="speed-slider"
              min={0}
              max={13}
              step={0.5}
              color={unit === 'ms' ? 'primary' : 'secondary'}
              sx={{ mt: 2 }}
            />
            <Typography 
              variant="h3" 
              sx={{ 
                textAlign: 'center', 
                mt: 4,
                fontWeight: 700,
                color: unit === 'ms' ? 'primary.main' : 'secondary.main'
              }}
            >
              {displaySpeed} {displayUnit}
            </Typography>
          </Box>

          {/* Power Control and Command Send */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 4, border: 2, borderColor: tunnelPower ? 'success.main' : 'grey.300', borderRadius: 2, bgcolor: tunnelPower ? 'success.lighter' : 'grey.50' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                FAN CONNECTION
              </Typography>
              <Box 
                onClick={handlePowerToggle}
                sx={{ 
                  width: 120, 
                  height: 60, 
                  borderRadius: 30, 
                  backgroundColor: tunnelPower ? 'success.main' : 'grey.400',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                  border: '2px solid',
                  borderColor: tunnelPower ? 'success.dark' : 'grey.500',
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    left: tunnelPower ? 64 : 4,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    transition: 'left 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Zap size={24} className={tunnelPower ? 'text-green-600' : 'text-gray-400'} />
                </Box>
              </Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700,
                  color: tunnelPower ? 'success.dark' : 'grey.600',
                  mt: 1
                }}
              >
                {tunnelPower ? 'ONLINE' : 'OFFLINE'}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<Send size={24} />}
              onClick={handleSendCommands}
              disabled={!tunnelPower}
              size="large"
              sx={{ 
                minWidth: 250, 
                height: 56, 
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              Apply Settings
            </Button>
          </Box>

          {/* Warning */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'error.lighter', border: 1, borderColor: 'error.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'error.dark' }}>
              ⚠️ Warning: Manual control overrides all running test profiles. Use with caution.
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <StatusCard/>
    </Grid>
  );
}

export default ManualControlTab;