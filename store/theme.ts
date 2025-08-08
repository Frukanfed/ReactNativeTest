// store/theme.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeType = 'light' | 'dark';

interface ThemeState {
    mode: ThemeType;
}

const initialState: ThemeState = {
    mode: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: state => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.mode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
