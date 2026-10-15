import { configureStore } from "@reduxjs/toolkit";
import reducer from "./features/todosSlice";
import categoriesReducer from "./features/categoriesSlice";

export const store = configureStore({
    reducer: {
        todos:reducer,
        categories: categoriesReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;