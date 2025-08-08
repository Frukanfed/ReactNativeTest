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

const Profile = () => {
  const currentUsername = useSelector((state: RootState) => state.user.name);
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const handleChangeUsername = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    dispatch(setUsername(trimmed));
    await AsyncStorage.setItem('username', trimmed);
    setInput('');
  };

  return (
    <View style={styles.Container}>
      <Image source={require('../assets/user.png')} style={styles.UserIcon} />

      <Text style={styles.ChangeUsernameLabel}>Kullanıcı Adı</Text>

      <View style={styles.ChangeUsername}>
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
      </View>
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
});

export default Profile;
