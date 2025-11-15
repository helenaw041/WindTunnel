import { SerialPort } from "serialport"
import { ReadlineParser } from "@serialport/parser-readline"
import { ListenerData } from "@shared/index"

import * as http from "http";
import * as path from "path"
import * as fs from "fs";

const serialPort = new SerialPort({
	path: '/dev/ttyACM0', // Replace with your serial port path (e.g., /dev/ttyUSB0 on Linux)
	baudRate: 9600, // Match the baud rate of your serial device
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));// Read the port data
serialPort.on("open", () => {
	console.log('serial port open');
});

parser.on('data', data =>{
	console.log('got word from arduino:', data);
});


