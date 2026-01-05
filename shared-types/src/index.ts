import { SerialPort } from "serialport"
import { ReadlineParser } from "@serialport/parser-readline"

import * as http from "http";
import * as path from "path"
import * as fs from "fs";

interface ListenerData {
	data: {[key: string]: any}	
}

interface ChannelSettings {
	type: string
}

interface ConfigFile {
	listen_port: number;
	listen_hostname: string;
	serve_port: number;
	serve_hostname: string;
	data_channels: {[key: string]: ChannelSettings};
}

type StreamData = [any]

export { ListenerData, ConfigFile, StreamData, ChannelSettings }
