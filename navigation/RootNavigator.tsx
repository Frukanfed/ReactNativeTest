import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../constants/Types';
import Auth from '../screens/Auth';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import { useDispatch } from 'react-redux';
import { setUsername } from '../store/user';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkUsername = async () => {
      const username = await AsyncStorage.getItem('username');

      if (username) {
        dispatch(setUsername(username));
      }

      setInitialRoute(username ? 'Home' : 'Auth');
    };

    checkUsername();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
