import { useState, useEffect } from "react";
import { recentDataState } from "src/states";
import StreamStore from "./StreamStore";
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
	const [data, setData] = useState<number[]>([]);

	return <>
		<StreamStore channel={channel} data={data} setData={setData}/>
		<RawGraph data={data}/>
	</>
}

export { Graph, RawGraph }
