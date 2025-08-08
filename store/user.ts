import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string | null;
}

const initialState: UserState = {
  name: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    clearUser: state => {
      state.name = null;
    },
  },
});

export const { setUsername, clearUser } = userSlice.actions;
export default userSlice.reducer;
