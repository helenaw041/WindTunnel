import React, { useState, useCallback, useMemo } from 'react';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, Container, Paper, Grid, Button, IconButton, Slider, List, ListItem, ListItemIcon, ListItemText, LinearProgress, Divider } from '@mui/material';
import { Home, Settings, User, Wrench, Send, Zap, TrendingUp, CheckCircle, AlertTriangle, Cloud, Gauge, SlidersHorizontal, Fan } from 'lucide-react'; // <-- Imported Fan

// --- Type Definitions ---

// Define the available tabs
type TabKey = 'home' | 'maintenance' | 'profiles' | 'manual';

// Define the structure for a test profile
interface TestProfile {
  id: number;
  name: string;
  speed: string;
  duration: string;
  status: 'Active' | 'Draft' | 'Completed';
}

// Define the structure for a maintenance task
interface MaintenanceTask {
  id: number;
  task: string;
  lastPerformed: string;
  status: 'Ok' | 'Warning' | 'Overdue';
}

// --- Mock Data ---

const mockProfiles: TestProfile[] = [
  { id: 1, name: 'Aero Foil Drag Test (Subsonic)', speed: '80 m/s', duration: '60 min', status: 'Active' },
  { id: 2, name: 'Boundary Layer Analysis', speed: '35 m/s', duration: '30 min', status: 'Completed' },
  { id: 3, name: 'Turbulence Study - Phase II', speed: '120 m/s', duration: '90 min', status: 'Draft' },
];

const mockMaintenance: MaintenanceTask[] = [
  { id: 1, task: 'Fan Motor Bearing Inspection', lastPerformed: '2025-10-01', status: 'Ok' },
  { id: 2, task: 'Tunnel Section Alignment Check', lastPerformed: '2024-05-15', status: 'Warning' },
  { id: 3, task: 'Filter Replacement (Overdue)', lastPerformed: '2023-11-20', status: 'Overdue' },
];

// --- Sub-Components ---

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  value: TabKey;
  currentTab: TabKey;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, currentTab, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== currentTab}
      id={`simple-tabpanel-${value}`}
      aria-labelledby={`simple-tab-${value}`}
      className="p-4"
      {...other}
    >
      {value === currentTab && <Box>{children}</Box>}
    </div>
  );
};

// --- Tab Content Components ---

const HomeTab: React.FC = () => {
  const currentSpeed = 75; // Mock data for current speed in m/s
  const motorTemp = 58; // Mock data for motor temperature in Celsius
  const pressureDiff = 1250; // Mock data for pressure differential in Pa
  const fanHealth = 85; // Mock data for fan health percentage

  const getHealthColor = useCallback((value: number) => {
    if (value > 80) return 'success';
    if (value > 50) return 'warning';
    return 'error';
  }, []);

  return (
    <Grid container spacing={4}>
      {/* System Status Overview Card */}
      <Grid item xs={12}>
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
                <Typography variant="h6" className="font-bold">{currentSpeed} m/s</Typography>
                <Typography variant="caption" color="textSecondary">Current Air Speed</Typography>
              </Box>
            </Grid>
            {/* Metric 2: Motor Temperature */}
            <Grid item xs={12} md={3}>
              <Box className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-red-50">
                <Zap className="text-red-600 mb-2" size={32} />
                <Typography variant="h6" className="font-bold">{motorTemp}°C</Typography>
                <Typography variant="caption" color="textSecondary">Motor Temperature</Typography>
              </Box>
            </Grid>
            {/* Metric 3: Pressure Differential */}
            <Grid item xs={12} md={3}>
              <Box className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-green-50">
                <Cloud className="text-green-600 mb-2" size={32} />
                <Typography variant="h6" className="font-bold">{pressureDiff} Pa</Typography>
                <Typography variant="caption" color="textSecondary">Static Pressure Difference</Typography>
              </Box>
            </Grid>
            {/* Metric 4: Fan Health */}
            <Grid item xs={12} md={3}>
              <Box className="flex flex-col p-3 border border-gray-200 rounded-lg bg-purple-50">
                <Box className="flex items-center justify-center mb-2">
                    <Wrench className="text-purple-600" size={32} />
                </Box>
                <Typography variant="h6" className="font-bold text-center">{fanHealth}%</Typography>
                <LinearProgress variant="determinate" value={fanHealth} color={getHealthColor(fanHealth)} className="h-2 rounded-full my-1" />
                <Typography variant="caption" color="textSecondary" className="text-center">Fan Health Index</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Control Panel Status Card */}
      <Grid item xs={12}>
        <Paper elevation={3} className="p-6 bg-white shadow-xl rounded-lg">
          <Box className="flex items-center space-x-3 mb-4">
            <Settings className="text-gray-500" size={24} />
            <Typography variant="h5" className="font-semibold text-gray-700">
              System Console Messages
            </Typography>
          </Box>
          <List dense className="max-h-60 overflow-y-auto">
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="2025-11-20 09:30: Initial power sequence completed successfully." secondary="System Ready" />
            </ListItem>
            <ListItem>
              <ListItemIcon><AlertTriangle color="warning" /></ListItemIcon>
              <ListItemText primary="2025-11-20 10:15: Minor bearing vibration detected (Threshold 1)." secondary="Motor Controller" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="2025-11-20 11:45: Speed ramp up to 80 m/s initiated for Profile 1." secondary="Test Automation" />
            </ListItem>
          </List>
          <Button variant="outlined" className="mt-4 text-sm">View Full Log</Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

const MaintenanceTab: React.FC = () => {
  const getStatusIcon = useCallback((status: 'Ok' | 'Warning' | 'Overdue') => {
    switch (status) {
      case 'Ok': return <CheckCircle color="success" />;
      case 'Warning': return <AlertTriangle color="warning" />;
      case 'Overdue': return <AlertTriangle color="error" />;
    }
  }, []);

  const getStatusLabel = useCallback((status: 'Ok' | 'Warning' | 'Overdue') => {
    const baseClasses = "py-1 px-3 text-xs font-semibold rounded-full";
    switch (status) {
      case 'Ok': return <span className={`${baseClasses} bg-green-100 text-green-800`}>OK</span>;
      case 'Warning': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Warning</span>;
      case 'Overdue': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Overdue</span>;
    }
  }, []);

  return (
    <Paper elevation={3} className="p-6 bg-white shadow-xl rounded-lg">
      <Box className="flex justify-between items-center mb-4">
        <Box className="flex items-center space-x-3">
          <Wrench className="text-orange-500" size={24} />
          <Typography variant="h5" className="font-semibold text-gray-700">
            Scheduled Maintenance Checklist
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<CheckCircle />} color="primary">
          Schedule New
        </Button>
      </Box>

      <List component="nav">
        {mockMaintenance.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding className="py-2">
              <ListItemIcon>{getStatusIcon(item.status)}</ListItemIcon>
              <ListItemText
                primary={item.task}
                secondary={`Last Performed: ${item.lastPerformed}`}
                className="flex-grow"
              />
              <Box className="min-w-[100px] text-right">{getStatusLabel(item.status)}</Box>
              <Button size="small" variant="outlined" className="ml-4">View Details</Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="body2" color="textSecondary" className="mt-4">
        Regular maintenance ensures optimal tunnel performance and longevity.
      </Typography>
    </Paper>
  );
};

const ProfilesTab: React.FC = () => {
  const getStatusColor = useCallback((status: TestProfile['status']) => {
    switch (status) {
      case 'Active': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Draft': return 'bg-gray-400';
    }
  }, []);

  return (
    <Paper elevation={3} className="p-6 bg-white shadow-xl rounded-lg">
      <Box className="flex justify-between items-center mb-4">
        <Box className="flex items-center space-x-3">
          <User className="text-teal-500" size={24} />
          <Typography variant="h5" className="font-semibold text-gray-700">
            Available Test Profiles
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Send />} color="secondary">
          Create New Profile
        </Button>
      </Box>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Speed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockProfiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.speed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(profile.status)}`}>
                    {profile.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button size="small" variant="text" className="text-blue-600 hover:text-blue-900">Run</Button>
                  <Button size="small" variant="text" className="ml-2 text-gray-600 hover:text-gray-900">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Paper>
  );
};

const ManualControlTab: React.FC = () => {
  const [targetSpeed, setTargetSpeed] = useState<number>(50);
  const [gatePosition, setGatePosition] = useState<number>(30);
  const [tunnelPower, setTunnelPower] = useState<boolean>(false);

  const handlePowerToggle = () => {
    setTunnelPower(prev => !prev);
  };

  // NOTE: Swapped alert() with console.log() as alert() is forbidden.
  const handleSendCommands = () => {
    console.log(`Sending commands:\nSpeed: ${targetSpeed} m/s\nGate: ${gatePosition}%\nPower: ${tunnelPower ? 'ON' : 'OFF'}`);
    // In a real application, you would send these commands to the control system API
  };

  return (
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
              valueLabelDisplay="on"
              min={0}
              max={200}
              step={5}
              color="primary"
            />
            <Typography variant="h4" className="text-center mt-2 text-blue-600">{targetSpeed} m/s</Typography>
          </Box>
        </Grid>

        {/* Gate Position Control */}
        <Grid item xs={12} md={6}>
          <Box className="p-4 border rounded-lg">
            <Typography variant="subtitle1" className="font-medium mb-4 flex items-center"><SlidersHorizontal className="mr-2" size={18} /> Gate Position (%)</Typography>
            <Slider
              value={gatePosition}
              onChange={(_e, newValue) => setGatePosition(newValue as number)}
              aria-labelledby="input-slider"
              valueLabelDisplay="on"
              min={0}
              max={100}
              step={1}
              color="secondary"
            />
            <Typography variant="h4" className="text-center mt-2 text-purple-600">{gatePosition}%</Typography>
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
  );
};


// --- Main Application Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const handleChange = useCallback((_event: React.SyntheticEvent, newValue: TabKey) => {
    setActiveTab(newValue);
  }, []);

  const tabProps = useCallback((index: TabKey) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }), []);

  // Use useMemo to prevent unnecessary re-renders of heavy components
  const content = useMemo(() => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'maintenance': return <MaintenanceTab />;
      case 'profiles': return <ProfilesTab />;
      case 'manual': return <ManualControlTab />;
      default: return <Typography>Tab content not found.</Typography>;
    }
  }, [activeTab]);


  return (
    <Box className="min-h-screen bg-gray-50 font-sans">
      {/* App Bar (Header) */}
      <AppBar position="static" color="primary" elevation={0} className="shadow-lg bg-blue-700">
        <Toolbar>
          <Fan size={32} className="text-white mr-3" />
          <Typography variant="h6" className="font-bold tracking-wide flex-grow">
            Wind Tunnel Control Dashboard
          </Typography>
          <Box className="flex items-center space-x-3">
            <Typography variant="body2" className="text-white/80">User: Admin</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Container */}
      <Container maxWidth="xl" className="py-8 px-4">
        <Paper elevation={4} className="rounded-xl overflow-hidden min-h-[70vh]">
          {/* Tabs Navigation */}
          <AppBar position="static" color="default" elevation={1}>
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label="dashboard tabs"
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label={<span className="flex items-center"><Home className="mr-2" size={18} /> Home Overview</span>}
                value="home"
                {...tabProps('home')}
              />
              <Tab
                label={<span className="flex items-center"><Wrench className="mr-2" size={18} /> Maintenance</span>}
                value="maintenance"
                {...tabProps('maintenance')}
              />
              <Tab
                label={<span className="flex items-center"><User className="mr-2" size={18} /> Test Profiles</span>}
                value="profiles"
                {...tabProps('profiles')}
              />
              <Tab
                label={<span className="flex items-center"><SlidersHorizontal className="mr-2" size={18} /> Manual Control</span>}
                value="manual"
                {...tabProps('manual')}
              />
            </Tabs>
          </AppBar>

          {/* Tab Content */}
          <TabPanel value="home" currentTab={activeTab}>
            {content}
          </TabPanel>
          <TabPanel value="maintenance" currentTab={activeTab}>
            {content}
          </TabPanel>
          <TabPanel value="profiles" currentTab={activeTab}>
            {content}
          </TabPanel>
          <TabPanel value="manual" currentTab={activeTab}>
            {content}
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;