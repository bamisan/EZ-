// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './store/userSlice';
import { userApi } from './store/userApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
