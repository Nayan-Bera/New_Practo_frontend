import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './services/baseApi';
import rootReducer, { RootState as BaseRootState } from './reducers';

const store = configureStore({
  reducer: {
    ...rootReducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = BaseRootState & {
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
};
export type AppDispatch = typeof store.dispatch;
export default store; 