import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

function UserModal({ open, onRegister, loading }) {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!nickname.trim()) {
            setError('Lütfen bir rumuz girin');
            return;
        }
        setError('');
        onRegister(nickname.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Dialog open={open} maxWidth="xs" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6">Hoş Geldiniz!</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Chat'e katılmak için bir rumuz girin:
                </Typography>
                <TextField
                    fullWidth
                    label="Rumuzunuz"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyPress={handleKeyPress}
                    error={!!error}
                    helperText={error}
                    autoFocus
                    inputProps={{ maxLength: 20 }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Kaydediliyor...' : 'Başla'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserModal;