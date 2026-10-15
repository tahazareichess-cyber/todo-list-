import api from './axios';

export async function getTodos(page = 1, limit = 10) {
    const response = await api.get("/api/todos/get", {
        params: {
            page,
            limit,
        },
    });

    return response.data;
}
interface CreateTodoInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  order: number;
}
export async function postTodos(todo:CreateTodoInput) {
  const response = await api.post("/api/todos/", todo);
  return response.data;
}

export async function deleteTodo(id: string){
    const response = await api.delete(`/api/todos/${id}`);
    return response.data;
}

interface UpdateTodoInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_completed: boolean;
  order: number;
}

export async function updateTodo(
  id: string,
  todo: UpdateTodoInput
) {
 const response = await api.put(`/api/todos/${id}`, todo);
  return response.data;
}