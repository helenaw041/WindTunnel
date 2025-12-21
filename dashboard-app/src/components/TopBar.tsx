import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../assets/logo.png'
import { tunnelPowerState } from '../states';
import { useStreamTop } from '../hooks/stream_hooks';

function TopBar() {
	const [tunnelPower] = tunnelPowerState.useState(); 
	
	return (
		<Box sx={{ flexGrow: 1 }}>
			{/* App Bar (Header) */}
			<AppBar position="static" color="primary" elevation={0} className="shadow-lg bg-blue-700">
				<Toolbar>
					{/* <Fan size={32} className="text-white mr-3" /> */}
					<img src={Logo} alt="Logo" style={{
						overflow: "hidden",
						width: "200px",
						height: "50px",
						objectFit: "none",
						transform: "scale(0.7)"
					}} />
					<Typography variant="h6" className="font-bold tracking-wide flex-grow">
						Wind Tunnel Control Dashboard
					</Typography>
					{/* <Box className="flex items-right space-x-3">
					<Typography variant="body2" className="text-white/80">User: Admin</Typography>
				</Box> */}
					<Box
						sx={{
							backgroundColor: 'white',
							borderRadius: 2,
							px: 2,
							py: 0.5,
							display: 'flex',
							alignItems: 'center',
							gap: 1.5
						}}
					>
						<Box 
							sx={{ 
								width: 16, 
								height: 16, 
								borderRadius: '50%',
								backgroundColor: tunnelPower ? 'success.main' : 'grey.400',
								animation: tunnelPower ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
								'@keyframes pulse': {
									'0%, 100%': { opacity: 1 },
									'50%': { opacity: 0.5 }
								}
							}}
						/>
						<Typography
							variant="subtitle1"
							sx={{
								fontWeight: 700,
								color: tunnelPower ? 'success.dark' : 'grey.600'
							}}
						>
							{tunnelPower ? 'ONLINE' : 'OFFLINE'}
						</Typography>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default TopBar;