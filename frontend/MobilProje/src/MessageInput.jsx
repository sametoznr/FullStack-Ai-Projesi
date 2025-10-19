import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function MessageInput({ onSendMessage, loading }) {
    const [value, setValue] = useState('');

    const submit = () => {
        const t = value.trim();
        if (!t || loading) return;
        onSendMessage(t);
        setValue('');
    };

    return (
        <View style={styles.wrap}>
            <TextInput
                mode="outlined"
                placeholder="Mesajınızı yazın..."
                value={value}
                onChangeText={setValue}
                disabled={loading}
                onSubmitEditing={submit}
                style={styles.input}
            />
            <Button
                mode="contained"
                onPress={submit}
                disabled={!value.trim() || loading}
                style={styles.btn}
            >
                Gönder
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: 'white',
        gap: 8,
    },
    input: { flex: 1 },
    btn: { alignSelf: 'center' },
});
