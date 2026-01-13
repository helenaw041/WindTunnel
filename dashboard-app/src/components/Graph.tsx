import { useState, useEffect } from "react";
import { recentDataState } from "src/states";
import { useStreamStore } from "../hooks/stream_hooks";
import { LineChart } from '@mui/x-charts/LineChart';


function RawGraph({data}: {data: number[]})
{
	return <>
		<LineChart
		  xAxis={[{ data: Array.from({ length: data.length }, (_, index) => index) }]}
		  series={[
			{
			  data: data,
			},
		  ]}
		  height={300}
		/>	
	</>
}

function Graph({channel}: {channel: string})
{
	const [data, setData] = useStreamStore(channel);

	return <>
		<RawGraph data={data}/>
	</>
}

export { Graph, RawGraph }
