import { useState, useEffect } from 'react'
import type { ListenerData, ConfigFile } from "@shared/index"
import { recentDataState } from './states';
import './App.css'
import TopBar from './components/TopBar';

import BasicGraph from './examples/BasicGraph.tsx';

function App() {
	const [configData, setConfigData] = useState<ConfigFile>();
	const [uuid, setUuid] = useState<string>("");
	const [recentData, setRecentData] = recentDataState.useState();

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
		});

		// Setting the timeout
		const fetchInterval = setInterval(() => {
			console.log("Fetching");
			fetch(`/get?client_id=${uuid}`).then(data => {
				return data.text()
			}).then((jsonString: string) => {
				const jsonData: ListenerData = JSON.parse(jsonString);
				console.log("recent data", jsonData);
				setRecentData(jsonData);	
			});
		}, 1000); // Calls every second

		return () => {
			clearInterval(fetchInterval);
		}
	}, []);



	
  return (
    <>
		<TopBar/>
		<BasicGraph/>
    </>
  )
}

export default App
