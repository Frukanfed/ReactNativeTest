import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInRight,
  ZoomOut,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';
import CheckBox from '@react-native-community/checkbox';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-worklets';

interface Props {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = 80;

const TodoItem = ({ title, completed, onToggle, onDelete }: Props) => {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const background = useSharedValue('white');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    backgroundColor: background.value,
    opacity: opacity.value,
  }));

  const checkboxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      // Sağa kaydırınca tamamla
      if (translateX.value > SWIPE_THRESHOLD) {
        background.value = '#C8E6C9';

        scale.value = withTiming(1.2, {}, () => {
          scale.value = withTiming(1);
        });

        runOnJS(onToggle)();

        background.value = withDelay(200, withTiming('white'));
      }

      // Sola kaydırınca sil
      else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-1000, { duration: 250 });
        opacity.value = withTiming(0, { duration: 250 }, () => {
          runOnJS(onDelete)();
        });
        return;
      }

      // Geri yerine getir
      translateX.value = withTiming(0);
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
            tintColors={{ true: '#4CAF50', false: '#aaa' }}
          />
        </Animated.View>
        <Text
          style={[
            styles.title,
            completed && {
              textDecorationLine: 'line-through',
              opacity: 0.6,
            },
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
    backgroundColor: 'white',
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
