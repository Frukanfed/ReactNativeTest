import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import Header from '../components/Header';

const Home = () => {
  return (
    <View style={styles.Container}>
      <Header />
      <View style={styles.Body}>
        <View style={styles.NewTodo}>
          <TextInput
            style={styles.Input}
            returnKeyType="done"
            placeholder="Yeni görev..."
            // value={}
            // onChangeText={}
          />
          <Pressable style={styles.NewTodoButton}>
            {({ pressed }) => (
              <Text style={[styles.ButtonText, { opacity: pressed ? 0.5 : 1 }]}>
                Ekle
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Body: {
    width: '100%',
  },
  NewTodo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-start',
  },
  Input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: 11,
    width: '80%',
    margin: 10,
  },
  NewTodoButton: {
    width: '10%',
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  ButtonText: {
    backgroundColor: '#007AFF',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: 'bold',
    fontSize: 11,
  },
});

export default Home;
