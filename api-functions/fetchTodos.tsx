import { Todo } from '../constants/Types';

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=5',
    );
    const data = await response.json();

    const normalized = data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      completed: item.completed,
    }));

    return normalized;
  } catch (error) {
    console.error('API fetch error:', error);
    return [];
  }
};
