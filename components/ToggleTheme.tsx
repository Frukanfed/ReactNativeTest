import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleTheme } from '../store/theme';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';
import { useThemeColors } from '../hooks/useThemeColors';

const ThemeToggle = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const progress = useSharedValue(theme === 'dark' ? 1 : 0);
  const colors = useThemeColors();

  useEffect(() => {
    progress.value = withSpring(theme === 'dark' ? 1 : 0);
  }, [theme]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(progress.value * 24) }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#e0e0e0', '#333'],
    ),
  }));

  const styles = createStyles(colors);

  return (
    <View style={styles.Row}>
      <Text style={styles.Label}>Tema</Text>
      <Pressable onPress={() => dispatch(toggleTheme())}>
        <Animated.View style={[styles.Switch, containerStyle]}>
          <Animated.View style={[styles.Thumb, thumbStyle]} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const createStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    Row: {
      width: '80%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 30,
    },
    Label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    Switch: {
      width: 50,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      padding: 2,
    },
    Thumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'white',
    },
  });

export default ThemeToggle;
