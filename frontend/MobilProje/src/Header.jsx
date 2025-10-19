import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Chip, Text, Button } from 'react-native-paper';

export default function Header({ user, onLogout }) {
    return (
        <Appbar.Header mode="center-aligned" elevated>
            <Appbar.Content title="Chat Sentiment AI" />
            <View style={styles.right}>
                <Chip
                    elevated
                    avatar={<Text style={styles.avatarText}>{user?.nickname?.[0]?.toUpperCase?.() || '?'}</Text>}
                    style={styles.chip}
                >
                    <Text variant="labelLarge">{user?.nickname}</Text>
                </Chip>
                <Button mode="text" onPress={onLogout}>
                    Çıkış
                </Button>
            </View>
        </Appbar.Header>
    );
}

const styles = StyleSheet.create({
    right: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 8 },
    chip: { backgroundColor: 'white' },
    avatarText: {
        width: 20, textAlign: 'center', fontWeight: '700'
    },
});
