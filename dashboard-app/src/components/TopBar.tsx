import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../assets/logo.png'

function TopBar()
{
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
				}}/>
				<Typography variant="h6" className="font-bold tracking-wide flex-grow">
					Wind Tunnel Control Dashboard
				</Typography>
				{/* <Box className="flex items-right space-x-3">
					<Typography variant="body2" className="text-white/80">User: Admin</Typography>
				</Box> */}
				</Toolbar>
			</AppBar>
		</Box>
	  );
}

export default TopBar;
