interface ListenerData {
    data: {
        [key: string]: any;
    };
}
interface ChannelSettings {
    type: string;
}
interface ConfigFile {
    listen_port: number;
    listen_hostname: string;
    serve_port: number;
    serve_hostname: string;
    data_channels: {
        [key: string]: ChannelSettings;
    };
}
type StreamData = [any];
export { ListenerData, ConfigFile, StreamData, ChannelSettings };
