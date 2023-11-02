import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "../actions/searchSlice";
import userSlice from "../actions/userSlice";
import userReducer from "../actions/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: userSlice,
    searchValue: searchSlice,
    reducer: persistedReducer,
  },
});

export const persistor = persistStore(store);
