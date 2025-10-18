import { useRef, useEffect } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import ChatMessage from './ChatMessage';

function MessageList({ messages, currentUserId }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                    Henüz mesaj yok. İlk mesajı gönderin!
                </Typography>
            </Box>
        );
    }

    return (
        <List>
            {messages.map((msg) => (
                <ListItem
                    key={msg.id}
                    sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        mb: 1
                    }}
                >
                    <ChatMessage
                        message={msg}
                        isCurrentUser={msg.userId === currentUserId}
                    />
                </ListItem>
            ))}
            <div ref={messagesEndRef} />
        </List>
    );
}

export default MessageList;