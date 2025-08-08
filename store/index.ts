import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import todosReducer from './todos';

const store = configureStore({
    reducer: {
        user: userReducer,
        todos: todosReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;