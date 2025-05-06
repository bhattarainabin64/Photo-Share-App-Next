import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/lib/services/auth'; 
import {uploadApi} from '@/lib/services/upload';
import authReducer from '@/lib/redux/slices/authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Using localStorage by default

// Persist configuration
const persistConfig = {
  key: 'root',
  storage, 
  whitelist: ['token', 'user'], // Only persist the auth slice
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // This is required for redux-persist
    }).concat(authApi.middleware), // Add authApi middleware for API calls
});

// Create the persistor instance
const persistor = persistStore(store);

export { store, persistor };
