import { Paper, Box, Typography, Chip } from '@mui/material';
import {
    SentimentSatisfied as HappyIcon,
    SentimentDissatisfied as SadIcon,
    SentimentNeutral as NeutralIcon
} from '@mui/icons-material';

function ChatMessage({ message, isCurrentUser }) {
    const getSentimentIcon = (sentiment) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return <HappyIcon sx={{ color: '#4CAF50' }} />;
            case 'negative':
                return <SadIcon sx={{ color: '#f44336' }} />;
            default:
                return <NeutralIcon sx={{ color: '#9E9E9E' }} />;
        }
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return 'success';
            case 'negative':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                width: '100%',
                bgcolor: isCurrentUser ? '#e3f2fd' : '#f5f5f5'
            }}
        >
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                    {message.userNickname}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {formatTime(message.createdAt)}
                </Typography>
            </Box>

            <Typography variant="body1" mb={1}>
                {message.content}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
                {getSentimentIcon(message.sentiment)}
                <Chip
                    label={`${message.sentiment} (${message.sentimentScore.toFixed(2)})`}
                    size="small"
                    color={getSentimentColor(message.sentiment)}
                    variant="outlined"
                />
            </Box>
        </Paper>
    );
}

export default ChatMessage;