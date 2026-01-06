import { useState, useEffect } from "react";
import { recentDataState } from "../states";

function useStreamStore(channel: string) {
	const [data, setData] = useState<any[]>([]);
	const [recentData] = recentDataState.useState();

	useEffect(() => {
		if (recentData.data[channel] == undefined) 
			return;

		// Append new data
		setData(prev => [...prev, ...recentData.data[channel]]);
	}, [recentData, channel]);

	return data;
}

function useStreamTop(channel: string, iniital: any = 0)
{
	const [data, setData] = useState<any>(iniital)
	const [recentData] = recentDataState.useState();
	useEffect(() => {
		if (recentData.data[channel] == undefined)
			return;

		setData(recentData.data[channel][recentData.data[channel].length - 1]);
	}, [recentData]);
	return data;
}

export { useStreamStore, useStreamTop }
