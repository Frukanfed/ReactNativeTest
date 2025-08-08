import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../constants/Types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { retry } from '@reduxjs/toolkit/query';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const Auth = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  };

  const handleLogin = async () => {
    if (!name.trim()) {
      setError(true);
      triggerShake();

      //3 saniye sonra error yazisi kaybolsun
      setTimeout(() => {
        setError(false);
      }, 3000);
      return;
    }
    await AsyncStorage.setItem('username', name.trim());
    navigation.replace('Home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.Container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.Label}>Uygulamaya Hoşgeldiniz</Text>
      <TextInput
        style={styles.Input}
        returnKeyType="done"
        placeholder="Ad Soyad"
        value={name}
        onChangeText={setName}
      />
      <Animated.View style={[styles.Button, shakeStyle]}>
        <Button
          title="Devam Et"
          onPress={handleLogin}
          accessibilityLabel="Devam et butonu"
        />
      </Animated.View>

      {error && <Text style={styles.ErrorText}>Lütfen adınızı girin.</Text>}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1, justifyContent: 'center', padding: 20 },
  Label: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 50,
    textAlign: 'center',
  },
  Input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  Button: {
    width: '30%',
    alignSelf: 'center',
  },
  ErrorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Auth;
