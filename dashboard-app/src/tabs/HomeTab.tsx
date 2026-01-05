import { useCallback } from "react";
import { Grid, Typography, Box, Paper, Button, List, ListItem, ListItemIcon, ListItemText, LinearProgress } from "@mui/material";
import { TrendingUp, Gauge, CheckCircle, Settings, Wrench, Cloud, AlertTriangle, Zap } from "lucide-react";

import StatusCard from "../components/StatusCard";
import LogCard from "../components/LogCard";

function HomeTab()
{
	

	return (<Grid container spacing={4}>
      <StatusCard/>
      <LogCard/>
      
    </Grid>)

	
}

export default HomeTab
