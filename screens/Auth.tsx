import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../constants/Types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { setUsername } from '../store/user';
import { runOnJS } from 'react-native-worklets';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const Auth = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const shakeX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const bgColor = useSharedValue('#007AFF');

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: bgColor.value,
  }));

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 50, easing: Easing.ease }),
      withTiming(8, { duration: 50, easing: Easing.ease }),
      withTiming(-8, { duration: 50, easing: Easing.ease }),
      withTiming(8, { duration: 50, easing: Easing.ease }),
      withTiming(0, { duration: 50, easing: Easing.ease }),
    );
  };

  const flash = () => {
    bgColor.value = withTiming('#75b7ff', { duration: 180 }, () => {
      bgColor.value = withTiming('#007AFF', { duration: 80 });
    });
  };

  const handleLogin = async () => {
    dispatch(setUsername(name.trim()));
    await AsyncStorage.setItem('username', name.trim());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleAnimatedLogin = () => {
    if (!name.trim()) {
      setError(true);
      triggerShake();
      setTimeout(() => setError(false), 3000);
      return;
    }

    scale.value = withSpring(0.97, undefined, () => {
      scale.value = withSpring(1);
      opacity.value = withTiming(0.9, { duration: 100 }, () => {
        opacity.value = withTiming(1, { duration: 100 }, () => {
          runOnJS(flash)();
          setTimeout(() => {
            runOnJS(handleLogin)();
          }, 100);
        });
      });
    });
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
      <Animated.View style={[styles.Button, shakeStyle, animStyle]}>
        <Pressable
          onPress={handleAnimatedLogin}
          accessibilityLabel="Devam Butonu"
        >
          <Text style={styles.ButtonText}>Devam Et</Text>
        </Pressable>
      </Animated.View>
      {error && <Text style={styles.ErrorText}>Lütfen adınızı girin.</Text>}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
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
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#007AFF',
  },
  ButtonText: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 12,
    fontWeight: 'bold',
    fontSize: 14,
  },
  ErrorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Auth;
