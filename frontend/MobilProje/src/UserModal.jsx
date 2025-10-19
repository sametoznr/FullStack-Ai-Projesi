import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Text, TextInput, Button } from 'react-native-paper';

export default function UserModal({ open, onRegister, loading }) {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const submit = () => {
        if (!nickname.trim()) {
            setError('Lütfen bir rumuz girin.');
            return;
        }
        setError('');
        onRegister(nickname.trim());
    };

    return (
        <Portal>
            <Dialog visible={open} style={styles.dialog} dismissable={false}>
                <Dialog.Title>Hoş Geldiniz!</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
                        Sohbete katılmak için bir rumuz girin:
                    </Text>
                    <TextInput
                        mode="outlined"
                        label="Rumuz"
                        value={nickname}
                        onChangeText={setNickname}
                        disabled={loading}
                        maxLength={20}
                        onSubmitEditing={submit}
                    />
                    {!!error && <Text style={styles.error}>{error}</Text>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button mode="contained" onPress={submit} loading={loading}>
                        Başla
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    dialog: { borderRadius: 12 },
    error: { color: '#d32f2f', marginTop: 8 },
});
