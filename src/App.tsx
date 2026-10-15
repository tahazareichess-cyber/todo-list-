
import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { setTodos } from './features/todosSlice';
import { getTodos } from './api/todosApi';
import { getCategories } from './api/categoriesApi';
import { setCategories } from './features/categoriesSlice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';
import CategoryTodosPage from './pages/CategoryTodosPage';
import TodoDetailsPage from './pages/TodoDtailsPage';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadAllTodos() {
      try {
        const firstPage = await getTodos(1, 10);
        const allTodos = [...firstPage.data];

        for (let page = 2; page <= firstPage.meta.totalPages; page++) {
          const response = await getTodos(page, 10);
          allTodos.push(...response.data);
        }

        dispatch(setTodos(allTodos));
      } catch (error) {
        console.error('Todos error:', error);
      }
    }

    loadAllTodos();

    getCategories()
      .then((response) => {
        dispatch(setCategories(response.data));
      })
      .catch((error) => {
        console.error('Categories error:', error);
      });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/todo/:todoId" element={<TodoDetailsPage />} />
        <Route path="/" element={<CategoriesPage />} />
        <Route
          path="/category/:categoryId"
          element={<CategoryTodosPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
