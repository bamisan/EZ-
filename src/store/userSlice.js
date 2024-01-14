import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    allUsers: [],
  },
  reducers: {
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    }
  },
});

export const { setAllUsers } = userSlice.actions;
export const selectAllUsers = (state) => state.user.allUsers;

export default userSlice.reducer;
