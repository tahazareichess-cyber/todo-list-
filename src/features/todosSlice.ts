import {createSlice, type PayloadAction} from '@reduxjs/toolkit'


interface Todo {
  _id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: [],
};

const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo:(state,action: PayloadAction<Todo>) =>{
            state.todos.push(action.payload)
        },
        removeTodo:(state, action: PayloadAction<string>) =>{
            state.todos = state.todos.filter((todo) => todo._id !== action.payload)
        },
        toggleTodo:(state, action: PayloadAction<string>)=>{
            const foundTodo = state.todos.find((todo) => todo._id === action.payload)
            if(foundTodo){
                foundTodo.is_completed = !foundTodo.is_completed;
            }
        },
        setTodos:(state, action: PayloadAction<Todo[]>) => {
            state.todos = action.payload;
        },
        editTodo: (state, action : PayloadAction<Todo>) =>{
            const index = state.todos.findIndex(
                (todo) => todo._id === action.payload._id
            );

            if(index !== -1){
                state.todos[index]= action.payload;
            }
        }
    },
});




export const { addTodo, removeTodo,toggleTodo,setTodos,editTodo } = todosSlice.actions;
export default todosSlice.reducer;