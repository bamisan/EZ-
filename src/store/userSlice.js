// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    allUsers: [],
    searchTerm: '',
  },
  reducers: {
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setAllUsers, setSearchTerm } = userSlice.actions;
export const selectAllUsers = (state) => state.user.allUsers;
export const selectSearchTerm = (state) => state.user.searchTerm;

export default userSlice.reducer;
