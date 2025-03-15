// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// Importe outros slices conforme necessário (ex.: partidas, decks, etc.)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Outros reducers aqui
  },
});

// Tipos auxiliares para uso no app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
