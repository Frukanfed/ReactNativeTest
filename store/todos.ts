import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../constants/Types';

interface TodosState {
    items: Todo[];
    filter: 'all' | 'active' | 'completed';
    status: 'idle' | 'loading' | 'error';
}

const initialState: TodosState = {
    items: [],
    filter: 'all',
    status: 'idle',
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        prependTodos: (state, action: PayloadAction<Todo[]>) => {
            // aynı idli varsa ekleme
            const newItems = action.payload.filter(
                incoming => !state.items.some(existing => existing.id === incoming.id)
            );
            state.items = [...newItems, ...state.items];
        },
        addTodo: (state, action: PayloadAction<Todo>) => {
            state.items.push(action.payload);
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.items.find(t => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
            state.filter = action.payload;
        },
        setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'error'>) => {
            state.status = action.payload;
        },
    },
});

export const {
    prependTodos,
    addTodo,
    toggleTodo,
    setFilter,
    setStatus,
} = todosSlice.actions;

export default todosSlice.reducer;
