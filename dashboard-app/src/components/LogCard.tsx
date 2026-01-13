import { Grid, Paper, ListItem, Box, Typography, ListItemIcon, ListItemText, List, Button } from "@mui/material"
import { Settings, CheckCircle, AlertTriangle } from "lucide-react"
import { useStreamStore } from "../hooks/stream_hooks"

function LogCard()
{
    const logs: string[] = useStreamStore("logs");

    return (<>
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
            {[...logs].reverse().map((value, index) => {
                return <ListItem key={index}>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary={value}  />
                    {/* secondary="System Ready" */}
                </ListItem>
            })}
          </List>
          <Button variant="outlined" className="mt-4 text-sm">View Full Log</Button>
        </Paper>
      </Grid>
    </>)
}

export default LogCard
