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
import { setUsername, clearUser } from '../store/user';
import { resetTodos } from '../store/todos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ThemeToggle from '../components/ToggleTheme';
import { useThemeColors } from '../hooks/useThemeColors';

const Profile = () => {
  const colors = useThemeColors();
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

  const styles = createStyles(colors);

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
          placeholderTextColor={colors.text + '99'}
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

      <Animated.View entering={FadeIn.delay(500)}>
        <ThemeToggle />
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

const createStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    Container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    UserIcon: {
      resizeMode: 'stretch',
      width: 100,
      height: 100,
      marginVertical: 70,
    },
    ChangeUsernameLabel: {
      width: '80%',
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.text,
    },
    ChangeUsername: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      paddingVertical: 20,
    },
    Input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      fontSize: 14,
      padding: 10,
      flex: 1,
      marginRight: 8,
      color: colors.text,
      backgroundColor: colors.card,
    },
    ChangeUsernameButton: {
      borderRadius: 6,
      backgroundColor: colors.button,
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
      borderColor: colors.border,
      borderRadius: 6,
      backgroundColor: colors.card,
    },
    StatsText: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 4,
      color: colors.text,
    },
    ClearButton: {
      marginTop: 140,
      backgroundColor: colors.danger,
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
