import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setUsername } from '../store/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUser } from '../store/user';
import { resetTodos } from '../store/todos';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';

const Profile = () => {
  const currentUsername = useSelector((state: RootState) => state.user.name);
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.items);
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const navigation = useNavigation();

  const handleReset = async () => {
    dispatch(clearUser());
    dispatch(resetTodos());
    await AsyncStorage.removeItem('username');

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      }),
    );
  };

  const handleChangeUsername = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    dispatch(setUsername(trimmed));
    await AsyncStorage.setItem('username', trimmed);
    setInput('');
  };

  return (
    <View style={styles.Container}>
      <Animated.Image
        entering={FadeIn.delay(0)}
        source={require('../assets/user.png')}
        style={styles.UserIcon}
      />

      <Animated.Text
        entering={FadeIn.delay(100)}
        style={styles.ChangeUsernameLabel}
      >
        Kullanıcı Adı
      </Animated.Text>

      <Animated.View entering={FadeIn.delay(200)} style={styles.ChangeUsername}>
        <TextInput
          style={styles.Input}
          returnKeyType="done"
          placeholder={`Güncel ad: ${currentUsername}`}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleChangeUsername}
        />
        <Pressable
          style={styles.ChangeUsernameButton}
          onPress={handleChangeUsername}
        >
          {({ pressed }) => (
            <Text style={[styles.ButtonText, { opacity: pressed ? 0.5 : 1 }]}>
              Değiştir
            </Text>
          )}
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300)} style={styles.Stats}>
        <Text style={styles.StatsText}>Toplam Görev: {total}</Text>
        <Text style={styles.StatsText}>Tamamlanan: {completed}</Text>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(400)} style={styles.ClearButton}>
        <Pressable onPress={handleReset}>
          {({ pressed }) => (
            <Text style={[styles.ClearText, { opacity: pressed ? 0.5 : 1 }]}>
              Verileri Temizle
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  UserIcon: {
    resizeMode: 'stretch',
    width: 100,
    height: 100,
    marginVertical: 70,
  },
  ChangeUsernameLabel: { width: '80%', fontWeight: 'bold', fontSize: 16 },
  ChangeUsername: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    paddingVertical: 20,
  },
  Input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: 14,
    padding: 10,
    flex: 1,
    marginRight: 8,
  },
  ChangeUsernameButton: {
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  ButtonText: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontWeight: 'bold',
    fontSize: 13,
  },
  Stats: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  StatsText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ClearButton: {
    marginTop: 140,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  ClearText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Profile;
