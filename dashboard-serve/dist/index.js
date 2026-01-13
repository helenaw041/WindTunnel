"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const mime = __importStar(require("mime"));
const srcDirectory = path.join(__dirname, '../..', "dashboard-app", "dist");
const configPath = path.join(__dirname, '../..', 'config.json');
const configJSON = JSON.parse(fs.readFileSync(configPath).toString());
const total_data = {};
const client_pickup_data = {};
// Setting up data
Object.keys(configJSON.data_channels).map((key) => {
    const channelSettings = configJSON.data_channels[key];
    switch (channelSettings.type) {
        case "stream":
            total_data[key] = [];
            break;
        default:
            total_data[key] = [];
            break;
    }
});
function refreshClientId(id) {
    if (client_pickup_data[id] == undefined) {
        client_pickup_data[id] = {};
        Object.keys(configJSON.data_channels).map((key) => {
            const channelConfig = configJSON.data_channels[key];
            client_pickup_data[id][key] = [];
        });
    }
}
// Create an HTTP server
const hostServer = http.createServer((req, res) => {
    // Set the response header
    let url = req.url || "";
    if (url == "/")
        url = "/index.html";
    const parsedUrl = new URL(`http://${configJSON.serve_hostname}${url}`);
    console.log("parsed url", parsedUrl.pathname);
    if (parsedUrl.pathname == "/get") {
        const packet = {
            data: {}
        };
        const clientId = parsedUrl.searchParams.get('client_id');
        if (clientId == null) {
            res.writeHead(403);
            console.log("rejected id", clientId);
            return res.end("No client id sent");
        }
        refreshClientId(clientId);
        Object.keys(configJSON.data_channels).map((key) => {
            const channelData = client_pickup_data[clientId][key];
            const channelSettings = configJSON.data_channels[key];
            switch (channelSettings.type) {
                case "stream":
                    packet.data[key] = JSON.parse(JSON.stringify(channelData));
                    client_pickup_data[clientId][key] = [];
                    break;
            }
        });
        const postString = JSON.stringify(packet);
        console.log("Sending", postString);
        console.log("Packet", packet);
        res.writeHead(200, { 'Content-Type': "application/json", "Content-Length": Buffer.byteLength(postString) });
        res.write(postString);
        return res.end();
    }
    const urlPath = decodeURIComponent(url);
    const requestedPath = path.normalize(path.join(srcDirectory, urlPath));
    if (!requestedPath.startsWith(srcDirectory)) {
        console.warn(`Directory traversal attempt detected: ${urlPath}`);
        res.writeHead(403);
        return res.end('Access denied.');
    }
    console.log(requestedPath);
    if (fs.existsSync(requestedPath)) {
        const contentType = mime.default.getType(path.basename(requestedPath)) || "";
        const fileData = fs.readFileSync(requestedPath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(fileData);
        return res.end();
    }
    else {
        res.writeHead(404);
        return res.end('File not found');
    }
});
function addData(data) {
    Object.keys(data.data).map((key) => {
        const channelData = data.data[key];
        const channelConfig = configJSON.data_channels[key];
        if (channelConfig == null) {
            console.warn("Invalid data channel");
            return;
        }
        switch (channelConfig.type) {
            case "stream":
                for (let i = 0; i < channelData.length; i++)
                    total_data[key].push(channelData[i]);
                Object.keys(client_pickup_data).map((client_id) => {
                    for (let i = 0; i < channelData.length; i++)
                        client_pickup_data[client_id][key].push(channelData[i]);
                });
                break;
        }
    });
}
const listenServer = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/data") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const parsed = JSON.parse(body);
            console.log("Received:", parsed);
            addData(parsed);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("Got data");
        });
    }
    else {
        res.writeHead(404);
        res.end("Not Found");
    }
});
// Start the servers
listenServer.listen(configJSON.listen_port, configJSON.listen_hostname, () => {
    console.log(`Listen Server running at http://${configJSON.listen_hostname}:${configJSON.listen_port}/`);
});
// Make the server listen on the specified port and hostname
hostServer.listen(configJSON.serve_port, configJSON.serve_hostname, () => {
    console.log(`Host Server running at http://${configJSON.serve_hostname}:${configJSON.serve_port}/`);
});
