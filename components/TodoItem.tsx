import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInRight,
  ZoomOut,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
  withDelay,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';
import CheckBox from '@react-native-community/checkbox';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-worklets';
import { useThemeColors } from '../hooks/useThemeColors';

interface Props {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = 80;

const TodoItem = ({ title, completed, onToggle, onDelete }: Props) => {
  const colors = useThemeColors();

  // motion values
  const translateX = useSharedValue(0);
  const itemScale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const baseBg = useSharedValue(colors.card);
  const flash = useSharedValue(0);

  // tema değişince base rengi güncelle
  useEffect(() => {
    baseBg.value = colors.card;
  }, [colors.card]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: itemScale.value }],
    opacity: opacity.value,
    backgroundColor: interpolateColor(
      flash.value,
      [0, 1],
      [baseBg.value, '#C8E6C9'],
    ),
  }));

  const checkboxBump = useSharedValue(1);
  const checkboxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxBump.value }],
  }));

  const gesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      // sağa kaydır tamamla (kısa yeşil flash  checkbox bump)
      if (translateX.value > SWIPE_THRESHOLD) {
        checkboxBump.value = withTiming(1.2, {}, () => {
          checkboxBump.value = withTiming(1);
        });

        flash.value = 1;
        flash.value = withDelay(200, withTiming(0));

        runOnJS(onToggle)();
      }
      // sola kaydır sil (throw-out fade shrink)
      else if (translateX.value < -SWIPE_THRESHOLD) {
        itemScale.value = withTiming(0.9, { duration: 250 });
        translateX.value = withTiming(-1000, { duration: 250 });
        opacity.value = withTiming(0, { duration: 250 }, () => {
          runOnJS(onDelete)();
        });
        return;
      }

      // geri yerine
      translateX.value = withTiming(0);
      itemScale.value = withTiming(1);
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        layout={LinearTransition.duration(300)}
        entering={FadeInRight.duration(300)}
        exiting={ZoomOut.duration(300)}
        style={[styles.item, animatedStyle]}
      >
        <Animated.View style={checkboxStyle}>
          <CheckBox
            value={completed}
            onValueChange={() => runOnJS(onToggle)()}
            tintColors={{ true: '#4CAF50', false: colors.border }}
          />
        </Animated.View>

        <Text
          style={[
            styles.title,
            { color: colors.text },
            completed && { textDecorationLine: 'line-through', opacity: 0.6 },
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
  },
});

//sadece proplar degisir ise rerenderle
export default React.memo(
  TodoItem,
  (prev, next) =>
    prev.title === next.title && prev.completed === next.completed,
);
