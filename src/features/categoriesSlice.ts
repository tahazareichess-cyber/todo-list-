import { createSlice , type PayloadAction} from "@reduxjs/toolkit";
interface Category{
    _id: string;
    name: string;
    description: string;
    todos:(string | { _id: string })[];
}

interface CategoriesState{
    categories:Category[]
}

const initialState: CategoriesState = {
    categories :[],
}

const categoriesSlice = createSlice({
    name:"categories",
    initialState,
    reducers: {
        setCategories:(state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        removeCategory:(state,action: PayloadAction<string>) => {
            state.categories = state.categories.filter((category) => category._id !== action.payload)
        },
        updateCategory: (state, action: PayloadAction<Category>) => {
        const index = state.categories.findIndex(
            (category) => category._id === action.payload._id
        );

        if (index !== -1) {
            state.categories[index] = action.payload;
        }
        },
    }
});

export const {setCategories , removeCategory,updateCategory} = categoriesSlice.actions
export default categoriesSlice.reducer