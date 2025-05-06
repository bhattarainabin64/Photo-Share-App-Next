
import { baseApi } from "./baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (fileData) => ({
        url: "/upload/photo/share",
        method: "POST",
        body: fileData,
      }),
    }),
    // get all photos with pagination and filtering and search

    getPhotos: builder.query({
      query: ({ page, limit, search, sortBy }) => ({
        url: `/upload/photos?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}`,
        method: "GET",
      }),
    }),

    // like a photo
    likePhoto: builder.mutation({
      query: (photoId) => ({
        url: `/upload/${photoId}/like`,
        method: "POST",
      }),
    }),
    // comment on a photo
    commentPhoto: builder.mutation({
      query: ({ photoId, text }) => ({
        url: `/upload/${photoId}/comment`,
        method: "POST",
        body: { text },
      }),
    }),


  }),
});


export const { useUploadFileMutation, useLazyGetPhotosQuery, useCommentPhotoMutation,useLikePhotoMutation  } = uploadApi;