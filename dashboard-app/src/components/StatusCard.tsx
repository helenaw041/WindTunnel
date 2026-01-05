import { useCallback } from "react";
import { Grid, Typography, Box, Paper, Button, List, ListItem, ListItemIcon, ListItemText, LinearProgress } from "@mui/material";
import { TrendingUp, Gauge, CheckCircle, Settings, Wrench, Cloud, AlertTriangle, Zap, Flame, Water } from "lucide-react";
import { useStreamTop } from "../hooks/stream_hooks";

function StatusCard()
{

    const windSpeed = useStreamTop("wind_speed", 0);
    const pressureDiff = useStreamTop("diff_pressure", 0);
	const airTemp = useStreamTop("air_temperature", 0);
	const airHumidity = useStreamTop("air_humidity", 0);


	const getHealthColor = useCallback((value: number) => {
		if (value > 80) return 'success';
		if (value > 50) return 'warning';
		return 'error';
	}, []);

	return (<>
		{/* System Status Overview Card */}
      <Grid >
        <Paper elevation={3} className="p-6 bg-white shadow-xl rounded-lg">
          <Box className="flex items-center space-x-3 mb-4">
            <Gauge className="text-blue-500" size={24} />
            <Typography variant="h5" className="font-semibold text-gray-700">
              Real-time Tunnel Status
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {/* Metric 1: Air Speed */}
            <Grid item xs={12} md={3}>
              <Box className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-blue-50">
                <TrendingUp className="text-blue-600 mb-2" size={32} />
                <Typography variant="h6" className="font-bold">{windSpeed} m/s</Typography>
                <Typography variant="caption" color="textSecondary">Current Air Speed</Typography>
              </Box>
            </Grid>
            {/* Metric 2: Air Temperature */}
            <Grid item xs={12} md={3}>
              <Box className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-red-50">
                <Zap className="text-red-600 mb-2" size={32} />
                <Typography variant="h6" className="font-bold">{airTemp}°C</Typography>
                <Typography variant="caption" color="textSecondary">Air Temperature</Typography>
              </Box>
            </Grid>
            {/* Metric 3: Air Humidity Differential */}
            <Grid item xs={12} md={3}>
              <Box className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-green-50">
                <Cloud className="text-green-600 mb-2" size={32} />
                <Typography variant="h6" className="font-bold">{airHumidity} %</Typography>
                <Typography variant="caption" color="textSecondary">Air Humidity</Typography>
              </Box>
            </Grid>
			{/* Metric 4: Pressure Differential */}
            <Grid item xs={12} md={3}>
              <Box className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-green-50">
                <Cloud className="text-green-600 mb-2" size={32} />
                <Typography variant="h6" className="font-bold">{pressureDiff} Pa</Typography>
                <Typography variant="caption" color="textSecondary">Static Pressure Difference</Typography>
              </Box>
            </Grid>
            {/* Metric 4: Fan Health */}
            {/* <Grid item xs={12} md={3}>
              <Box className="flex flex-col p-3 border border-gray-200 rounded-lg bg-purple-50">
                <Box className="flex items-center justify-center mb-2">
                    <Wrench className="text-purple-600" size={32} />
                </Box>
                <Typography variant="h6" className="font-bold text-center">{fanHealth}%</Typography>
                <LinearProgress variant="determinate" value={fanHealth} color={getHealthColor(fanHealth)} className="h-2 rounded-full my-1" />
                <Typography variant="caption" color="textSecondary" className="text-center">Fan Health Index</Typography>
              </Box>
            </Grid> */}
          </Grid>
        </Paper>
      </Grid></>
	)
}

export default StatusCard