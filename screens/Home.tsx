import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  prependTodos,
  addTodo,
  toggleTodo,
  setStatus,
  setFilter,
  deleteTodo,
} from '../store/todos';
import { fetchTodos } from '../api-functions/fetchTodos';
import Header from '../components/Header';
import uuid from 'react-native-uuid';
import TodoItem from '../components/TodoItem';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../hooks/useThemeColors';

const Home = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const opacity = useSharedValue(1);
  const colors = useThemeColors();

  const {
    items: todos,
    status,
    filter,
  } = useSelector((state: RootState) => state.todos);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
  });

  useEffect(() => {
    const load = async () => {
      try {
        dispatch(setStatus('loading'));
        const remoteTodos = await fetchTodos();

        const existingIds = new Set(todos.map(todo => todo.id));
        const newTodos = remoteTodos
          .map(todo => ({ ...todo, id: todo.id.toString() }))
          .filter(todo => !existingIds.has(todo.id));

        dispatch(prependTodos(newTodos));
        dispatch(setStatus('idle'));
      } catch (e) {
        dispatch(setStatus('error'));
      }
    };

    load();
  }, []);

  const handleAdd = () => {
    if (!input.trim()) return;

    const newTodo = {
      id: uuid.v4().toString(),
      title: input.trim(),
      completed: false,
    };

    dispatch(addTodo(newTodo));
    setInput('');
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTodo(id));
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleRetry = () => {
    dispatch(setStatus('idle'));
  };

  const renderItem = ({ item }: any) => (
    <TodoItem
      title={item.title}
      completed={item.completed}
      onToggle={() => handleToggle(item.id)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 40 }, () => {
      opacity.value = withTiming(1, { duration: 260 });
    });
  }, [filter]);
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const styles = createStyles(colors);

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
        <View style={styles.Filters}>
          {['all', 'active', 'completed'].map(f => (
            <Pressable
              key={f}
              style={[
                styles.FilterButton,
                filter === f && styles.FilterButtonActive,
              ]}
              onPress={() => dispatch(setFilter(f as any))}
            >
              <Text
                style={[
                  styles.FilterButtonText,
                  filter === f && styles.FilterButtonTextActive,
                ]}
              >
                {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Tamamlanan'}
              </Text>
            </Pressable>
          ))}
        </View>
        {status === 'loading' && (
          <ActivityIndicator size="large" color="#007AFF" />
        )}

        {status === 'error' && (
          <View style={styles.Center}>
            <Text style={styles.ErrorText}>Hata oluştu.</Text>
            <Pressable onPress={handleRetry} style={styles.RetryButton}>
              <Text style={styles.RetryText}>Tekrar Dene</Text>
            </Pressable>
          </View>
        )}

        {filteredTodos.length === 0 && status === 'idle' && (
          <View style={styles.Center}>
            <Text>Görev yok.</Text>
          </View>
        )}
        <Animated.View style={[{ flex: 1 }, fadeStyle]}>
          <FlatList
            data={filteredTodos}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            getItemLayout={(_, index) => ({
              length: 60,
              offset: 60 * index,
              index,
            })}
            removeClippedSubviews={true}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const createStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    Container: {
      flex: 1,
      backgroundColor: colors.background,
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
      borderColor: colors.border,
      borderRadius: 6,
      fontSize: 14,
      padding: 10,
      flex: 1,
      marginRight: 8,
      color: colors.text,
      backgroundColor: colors.card,
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
    Center: {
      alignItems: 'center',
      marginVertical: 20,
    },
    ErrorText: {
      color: 'red',
      marginBottom: 10,
    },
    RetryButton: {
      padding: 10,
      backgroundColor: '#007AFF',
      borderRadius: 6,
    },
    RetryText: {
      color: 'white',
      fontWeight: 'bold',
    },
    Filters: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 12,
      gap: 8,
      borderBottomWidth: 1,
      paddingBottom: 10,
      borderColor: colors.border,
    },
    FilterButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: '#eee',
    },
    FilterButtonActive: {
      backgroundColor: '#007AFF',
    },
    FilterButtonText: {
      fontSize: 13,
      fontWeight: '500',
      color: '#333',
    },
    FilterButtonTextActive: {
      color: '#fff',
    },
  });

export default Home;
