import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthScreen } from '../../features/auth/AuthScreen';
import { HomeScreen } from '../../features/home/HomeScreen';
import { EpisodePlayerScreen } from '../../features/episodePlayer/EpisodePlayerScreen';
import { PlayerLabScreen } from '../../features/playerLab/PlayerLabScreen';
import { SettingsScreen } from '../../features/settings/SettingsScreen';
import { useAuthState } from '../hooks/useAuthState';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  EpisodePlayer: { episodeId?: string } | undefined;
  PlayerLab: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const user = useAuthState((state) => state.user);

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="EpisodePlayer" component={EpisodePlayerScreen} />
            <Stack.Screen name="PlayerLab" component={PlayerLabScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
