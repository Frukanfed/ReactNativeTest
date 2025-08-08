import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import todosReducer from './todos';
import themeReducer from './theme';

const store = configureStore({
    reducer: {
        user: userReducer,
        todos: todosReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;