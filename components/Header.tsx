import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { useSelector } from 'react-redux';

const Header = () => {
  const username = useSelector((state: any) => state.user.name);

  return (
    <View style={styles.Container}>
      <Text style={styles.Header}>Merhaba, {username}</Text>

      <Pressable onPress={() => {}}>
        {({ pressed }) => (
          <Image
            source={require('../assets/user.png')}
            style={[styles.UserIcon, { opacity: pressed ? 0.5 : 1 }]}
          />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: '#bfbdbd',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
  Header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  UserIcon: {
    width: 25,
    height: 25,
    resizeMode: 'stretch',
  },
});

export default Header;
