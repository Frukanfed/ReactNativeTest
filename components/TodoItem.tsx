import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

interface Props {
  title: string;
  completed: boolean;
  onToggle: () => void;
}

const TodoItem = ({ title, completed, onToggle }: Props) => {
  return (
    <View style={styles.item}>
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
    </View>
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
  },
});

export default TodoItem;
