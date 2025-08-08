import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

const initialState: Todo[] = [];

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        prependTodos: (state, action: PayloadAction<Todo[]>) => {
            return [...action.payload, ...state];
        },
        addTodo: (state, action: PayloadAction<Todo>) => {
            state.unshift(action.payload);
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.find(t => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
    },
});

export const { prependTodos, addTodo, toggleTodo } = todosSlice.actions;
export default todosSlice.reducer;
