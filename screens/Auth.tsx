import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../constants/Types';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const Auth = ({ navigation }: Props) => {
  const [name, setName] = useState('');

  const handleLogin = async () => {
    if (!name.trim()) return;
    await AsyncStorage.setItem('username', name.trim());
    navigation.replace('Home');
  };

  return (
    <View style={styles.Container}>
      <Text style={styles.Label}>Adınızı Girin:</Text>
      <TextInput
        style={styles.Input}
        placeholder="Kullanıcı adı"
        value={name}
        onChangeText={setName}
      />
      <Button title="Giriş Yap" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: { flex: 1, justifyContent: 'center', padding: 20 },
  Label: { fontSize: 18, marginBottom: 8 },
  Input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
});

export default Auth;
