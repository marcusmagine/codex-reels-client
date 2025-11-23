import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthState } from '../../shared/hooks/useAuthState';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthState();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Subscription</Text>
        <Text style={styles.value}>{user?.subscriptionStatus ?? 'none'}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={logout}>
        <Text style={styles.secondaryText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#050507',
    gap: 12
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700'
  },
  card: {
    backgroundColor: '#0f0f16',
    borderRadius: 12,
    padding: 16,
    gap: 6
  },
  label: {
    color: '#9da3b4',
    fontSize: 12
  },
  value: {
    color: '#fff',
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#5b6dff',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  secondary: {
    backgroundColor: '#1a1a22'
  },
  secondaryText: {
    color: '#d7ddff',
    fontWeight: '600'
  }
});
