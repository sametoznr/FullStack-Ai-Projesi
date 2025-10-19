import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';

function iconFor(sentiment) {
    const s = (sentiment || '').toLowerCase();
    if (s === 'positive') return '🙂';
    if (s === 'negative') return '☹️';
    return '😐';
}
function chipStyle(sentiment) {
    const s = (sentiment || '').toLowerCase();
    if (s === 'positive') return { backgroundColor: '#E8F5E9' };
    if (s === 'negative') return { backgroundColor: '#FFEBEE' };
    return { backgroundColor: '#EEEEEE' };
}
function timeOf(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message, isCurrentUser }) {
    return (
        <Card style={[styles.card, isCurrentUser ? styles.me : styles.other]} mode="outlined">
            <Card.Title
                title={<Text variant="titleMedium" style={styles.user}>{message.userNickname}</Text>}
                subtitle={<Text variant="bodySmall" style={styles.time}>{timeOf(message.createdAt)}</Text>}
                titleNumberOfLines={1}
            />
            <Card.Content>
                <Text style={styles.body}>{message.content}</Text>
                <Chip compact style={[styles.chip, chipStyle(message.sentiment)]}>
                    {iconFor(message.sentiment)}{' '}
                    {`${message.sentiment ?? 'neutral'} (${(message.sentimentScore ?? 0).toFixed?.(2) || '0.00'})`}
                </Chip>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 12 },
    me: { backgroundColor: '#E3F2FD' },
    other: { backgroundColor: '#F5F5F5' },
    user: { fontWeight: '700' },
    time: { opacity: 0.6 },
    body: { marginBottom: 8 },
    chip: { alignSelf: 'flex-start' },
});
