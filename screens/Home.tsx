import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const colors = useThemeColors();

  const {
    items: todos,
    status,
    filter,
  } = useSelector((state: RootState) => state.todos);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    return todo.completed;
  });

  const todosRef = useRef(todos);
  useEffect(() => {
    todosRef.current = todos; // her değişimde günceli sakla
  }, [todos]);

  const loadTodos = useCallback(async () => {
    try {
      dispatch(setStatus('loading'));
      const remoteTodos = await fetchTodos();

      const existingIds = new Set(todosRef.current.map(t => t.id));
      const newTodos = remoteTodos
        .map(t => ({ ...t, id: t.id.toString() }))
        .filter(t => !existingIds.has(t.id));

      dispatch(prependTodos(newTodos));
      dispatch(setStatus('idle'));
    } catch {
      dispatch(setStatus('error'));
    }
  }, [dispatch]);

  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

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

  const handleToggle = (id: string) => dispatch(toggleTodo(id));
  const handleDelete = (id: string) => dispatch(deleteTodo(id));
  const handleRetry = () => loadTodos();

  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withTiming(0, { duration: 80 }, () => {
      opacity.value = withTiming(1, { duration: 240 });
    });
  }, [filter]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const styles = createStyles(colors);

  const renderItem = ({ item }: any) => (
    <TodoItem
      title={item.title}
      completed={item.completed}
      onToggle={() => handleToggle(item.id)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  return (
    <View style={styles.Container}>
      <Header />
      <View style={styles.Body}>
        {/* New Todo */}
        <View style={styles.NewTodo}>
          <TextInput
            style={styles.Input}
            returnKeyType="done"
            placeholder="Yeni görev..."
            placeholderTextColor={colors.text + '99'}
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

        {/* Filters */}
        <View style={styles.Filters}>
          {(['all', 'active', 'completed'] as const).map(f => (
            <Pressable
              key={f}
              style={[
                styles.FilterButton,
                filter === f && styles.FilterButtonActive,
              ]}
              onPress={() => dispatch(setFilter(f))}
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

        {/* Loading */}
        {status === 'loading' && (
          <ActivityIndicator size="large" color={colors.button} />
        )}

        {/* Error */}
        {status === 'error' && (
          <View style={styles.Center}>
            <Text style={[styles.ErrorText, { color: colors.danger }]}>
              Hata oluştu.
            </Text>
            <Pressable onPress={handleRetry} style={styles.RetryButton}>
              <Text style={styles.RetryText}>Tekrar Dene</Text>
            </Pressable>
          </View>
        )}

        {/* Empty */}
        {status === 'idle' &&
          (filteredTodos.length === 0 ? (
            <View style={styles.Center}>
              <Text style={{ color: colors.text }}>Görev yok.</Text>
            </View>
          ) : (
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
                removeClippedSubviews
                contentContainerStyle={{ paddingBottom: 40 }}
              />
            </Animated.View>
          ))}
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
      backgroundColor: colors.card,
      color: colors.text,
    },
    NewTodoButton: {
      borderRadius: 6,
      backgroundColor: colors.button,
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
      marginBottom: 10,
      fontWeight: '600',
    },
    RetryButton: {
      padding: 10,
      backgroundColor: colors.button,
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
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    FilterButtonActive: {
      backgroundColor: colors.button,
      borderColor: colors.button,
    },
    FilterButtonText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.text,
    },
    FilterButtonTextActive: {
      color: '#fff',
    },
  });

export default Home;
