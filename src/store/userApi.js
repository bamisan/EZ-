// userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => 'users',
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
