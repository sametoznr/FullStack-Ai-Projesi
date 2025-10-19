import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import ChatMessage from './ChatMessage';

export default function MessageList({ messages, currentUserId }) {
    const listRef = useRef(null);

    useEffect(() => {
        if (messages?.length > 0) {
            setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
        }
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={{ opacity: 0.6 }}>Henüz mesaj yok. İlk mesajı gönderin!</Text>
            </View>
        );
    }

    return (
        <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => String(m.id)}
            contentContainerStyle={{ padding: 12, gap: 8 }}
            renderItem={({ item }) => (
                <ChatMessage message={item} isCurrentUser={item.userId === currentUserId} />
            )}
            style={{ flex: 1 }}
        />
    );
}

const styles = StyleSheet.create({
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
