import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { prependTodos, addTodo, toggleTodo } from '../store/todos';
import { fetchTodos } from '../api-functions/fetchTodos';
import Header from '../components/Header';
import uuid from 'react-native-uuid';
import CheckBox from '@react-native-community/checkbox';
import TodoItem from '../components/TodoItem';

const Home = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    const load = async () => {
      const remoteTodos = await fetchTodos();

      // ayni idlileri yeniden yazma
      const existingIds = new Set(todos.map(todo => todo.id));
      const newTodos = remoteTodos.filter(todo => !existingIds.has(todo.id));

      if (newTodos.length > 0) {
        dispatch(prependTodos(newTodos));
      }
    };

    load();
  }, []);

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch(
      addTodo({
        id: uuid.v4().toString(),
        title: input.trim(),
        completed: false,
      }),
    );
    setInput('');
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const renderItem = ({ item }: any) => (
    <TodoItem
      title={item.title}
      completed={item.completed}
      onToggle={() => handleToggle(item.id)}
    />
  );

  return (
    <View style={styles.Container}>
      <Header />
      <View style={styles.Body}>
        <View style={styles.NewTodo}>
          <TextInput
            style={styles.Input}
            returnKeyType="done"
            placeholder="Yeni görev..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAdd}
          />
          <Pressable style={styles.NewTodoButton} onPress={handleAdd}>
            {({ pressed }) => (
              <Text style={[styles.ButtonText, { opacity: pressed ? 0.5 : 1 }]}>
                Ekle
              </Text>
            )}
          </Pressable>
        </View>

        <FlatList
          data={todos}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Body: {
    flex: 1,
    padding: 20,
  },
  NewTodo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  NewTodoButton: {
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

export default Home;
