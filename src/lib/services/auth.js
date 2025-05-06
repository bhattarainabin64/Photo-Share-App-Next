import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    tagTypes: ["auth"],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => ({
        url: "/auth/signup",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserDetails: builder.query({
      query: () => "/auth/profile",
    }),
  }),
});

export const { useCreateUserMutation, useLoginUserMutation, useGetUserDetailsQuery } = authApi;
