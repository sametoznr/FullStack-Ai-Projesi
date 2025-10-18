import {
    AppBar,
    Toolbar,
    Typography,
    Chip,
    Avatar,
    IconButton
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

function Header({ user, onLogout }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Chat Sentiment AI
                </Typography>
                <Chip
                    avatar={<Avatar>{user.nickname[0].toUpperCase()}</Avatar>}
                    label={user.nickname}
                    color="default"
                    sx={{ bgcolor: 'white', fontWeight: 'bold' }}
                />
                <IconButton color="inherit" onClick={onLogout} sx={{ ml: 1 }}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Header;