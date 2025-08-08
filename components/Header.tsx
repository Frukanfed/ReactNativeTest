import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../constants/Types';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useThemeColors } from '../hooks/useThemeColors';

const Header = () => {
  const username = useSelector((state: any) => state.user.name);
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

  const styles = createStyles(colors);
  return (
    <View style={styles.Container}>
      <Text style={styles.Header}>Merhaba, {username}</Text>

      <Pressable onPress={() => navigation.navigate('Profile')}>
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

const createStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    Container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    },
    Header: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    UserIcon: {
      width: 25,
      height: 25,
      resizeMode: 'stretch',
    },
  });

export default Header;
