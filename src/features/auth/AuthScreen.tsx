import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthState } from '../../shared/hooks/useAuthState';

export const AuthScreen: React.FC = () => {
  const login = useAuthState((state) => state.login);
  const [email, setEmail] = useState('demo@reelsdrama.app');
  const [password, setPassword] = useState('password');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ReelsDrama</Text>
        <Text style={styles.subtitle}>Sign in with email</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={() => login(email, password)}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050507',
    justifyContent: 'center',
    padding: 24
  },
  card: {
    backgroundColor: '#0f0f16',
    padding: 24,
    borderRadius: 12,
    gap: 12
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700'
  },
  subtitle: {
    color: '#a0a0ad'
  },
  input: {
    backgroundColor: '#1a1a22',
    color: '#fff',
    padding: 12,
    borderRadius: 8
  },
  button: {
    marginTop: 8,
    backgroundColor: '#5b6dff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  }
});
