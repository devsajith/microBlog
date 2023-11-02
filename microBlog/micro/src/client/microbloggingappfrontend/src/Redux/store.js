import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'
import { persistReducer, persistStore } from 'redux-persist'; 
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    storageSession,
  }
  
  const persistedReducer = persistReducer(persistConfig, userReducer)
  
  export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
  })
  
  export const persistor = persistStore(store)