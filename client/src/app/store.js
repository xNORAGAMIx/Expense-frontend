import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import groupReducer from "../features/groups/groupSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 

// 1. Configure persistence
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["email", "token", "isAuthenticated"], 
};

// Groups persist config
const groupsPersistConfig = {
  key: "groups",
  storage,
  whitelist: ["groups"], // Make sure your state is an object with `groups` key
};

// 2. Create persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedGroupReducer = persistReducer(groupsPersistConfig, groupReducer);

// 3. Setup store with middleware config
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    groups: persistedGroupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 4. Export persistor
export const persistor = persistStore(store);
