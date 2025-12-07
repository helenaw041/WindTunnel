import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ListenerData, ConfigFile } from "@shared/index"
import { Box, Paper, Container, AppBar, Tabs, Tab, Typography } from '@mui/material';
import { Home, Settings, User, Wrench, Send, Zap, TrendingUp, CheckCircle, AlertTriangle, Cloud, Gauge, SlidersHorizontal, Fan } from 'lucide-react'; // <-- Imported Fan
import { recentDataState } from './states';
import './App.css'
import HomeTab from './tabs/HomeTab.tsx';
import ManualControlTab from './tabs/ManualControl.tsx';


import TopBar from './components/TopBar';

import BasicGraph from './examples/BasicGraph.tsx';

type TabKey = 'home' | 'maintenance' | 'profiles' | 'manual';

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

function App() {
	const [configData, setConfigData] = useState<ConfigFile>();
	const [uuid, setUuid] = useState<string>("");
	const [recentData, setRecentData] = recentDataState.useState();

	const [activeTab, setActiveTab] = useState<TabKey>('home');
	
	const handleChange = useCallback((_event: React.SyntheticEvent, newValue: TabKey) => {
		setActiveTab(newValue);
	}, []);

	const tabProps = useCallback((index: TabKey) => ({
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}), []);

	useEffect(() => {
		// Generating UUID to use for communication
		// Not intended to be security
		const uuid: string = crypto.randomUUID();
		setUuid(uuid);


		// Getting config file	
		fetch("/config.json").then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			return response.json(); // Or .text(), .blob(), etc.
		}).then(data => {
			setConfigData(data)
			console.log("Recieved config data", data);
		}).catch((reason) => {
			console.log("Errored config data", reason)
		});

		// Setting the timeout
		const fetchInterval = setInterval(() => {
			console.log("Fetching");
			fetch(`/get?client_id=${uuid}`).then(data => {
				return data.text()
			}).then((jsonString: string) => {
				try {
					const jsonData: ListenerData = JSON.parse(jsonString);
					console.log("recent data", jsonData);
					setRecentData(jsonData);	
				} catch {
					console.log("Unable to read recent data", jsonString);
				}
				
			});
		}, 1000); // Calls every second

		return () => {
			clearInterval(fetchInterval);
		}
	}, []);


	const content = useMemo(() => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
    //   case 'maintenance': return <MaintenanceTab />;
    //   case 'profiles': return <ProfilesTab />;
      case 'manual': return <ManualControlTab />;
      default: return <Typography>Tab content not found.</Typography>;
    }
  }, [activeTab]);
	
  return (
    <>
	<Box className="min-h-screen bg-gray-50 font-sans">
		<TopBar/>
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
    </>
  )
}

export default App
