import React from 'react';
import { Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Animated, {
  FadeIn,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';

interface Props {
  title: string;
  completed: boolean;
  onToggle: () => void;
}

const TodoItem = ({ title, completed, onToggle }: Props) => {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOutUp}
      style={styles.item}
    >
      <CheckBox
        value={completed}
        onValueChange={onToggle}
        tintColors={{ true: '#4CAF50', false: '#aaa' }}
      />
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
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
