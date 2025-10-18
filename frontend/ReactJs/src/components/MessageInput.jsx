import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

function MessageInput({ onSendMessage, loading }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 2,
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: 1
            }}
        >
            <TextField
                fullWidth
                placeholder="Mesajınızı yazın..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                inputProps={{ maxLength: 500 }}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={loading || !message.trim()}
                endIcon={<SendIcon />}
            >
                Gönder
            </Button>
        </Box>
    );
}

export default MessageInput;