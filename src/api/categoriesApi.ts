import api from './axios';

interface CreateCategoryInput{
    name: string,
    description: string,
    todos: (string[])
}


export async function createCategory(category :CreateCategoryInput){
    const response = await api.post("/api/categories/", category);
    return response.data
}

export async function getCategories(){
    const response = await api.get("/api/categories/get");
    return response.data;
}

export async function deleteCategory(id: string){
    const response = await api.delete(`/api/categories/${id}`);
    return response.data
}


export async function assignTodosToCategory(
  categoryId: string,
  todoIds: string[]
) {
  const response = await api.post(
    `/api/categories/${categoryId}/assign-todos`,
    {
    todoIds,
    replace: false,
    }
  );

  return response.data;
}

export async function editCategory(
    id: string,
    category: CreateCategoryInput
) {
    const response = await api.put(`/api/categories/${id}`, category);
    return response.data;
}