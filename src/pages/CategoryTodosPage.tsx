
import { useAppDispatch, useAppSelector } from "../hooks";
import { useState , useEffect } from "react";
import { postTodos,deleteTodo,updateTodo } from "../api/todosApi";
import { assignTodosToCategory } from "../api/categoriesApi";
import { addTodo, removeTodo, editTodo, toggleTodo } from "../features/todosSlice";
import { updateCategory } from "../features/categoriesSlice";
import { useParams, useNavigate } from "react-router-dom";
function CategoryTodosPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 5;
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("title-asc");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
    const { categoryId } = useParams();
    const categories = useAppSelector((state) => state.categories.categories);
    const todos = useAppSelector((state) => state.todos.todos);
    const selectedCategory = categories.find(
        (category) => category._id === categoryId
        );
    const categoryTodos = todos.filter((todo) => {
    if (!selectedCategory) return false;

    return selectedCategory.todos.some((categoryTodo) =>
        typeof categoryTodo === "string"
            ? categoryTodo === todo._id
            : categoryTodo._id === todo._id
        );
});
const filteredCategoryTodos = categoryTodos.filter((todo) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
        todo.title.toLowerCase().includes(search) ||
        todo.description.toLowerCase().includes(search);

    const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && todo.is_completed) ||
        (statusFilter === "incomplete" && !todo.is_completed);
    const todoDate = new Date(todo.start_date)
    .toISOString()
    .slice(0, 10);

    const matchesDateFrom = !dateFrom || todoDate >= dateFrom;
    const matchesDateTo = !dateTo || todoDate <= dateTo;
    return (
    matchesSearch &&
    matchesStatus &&
    matchesDateFrom &&
    matchesDateTo
    );
});
const sortedCategoryTodos = [...filteredCategoryTodos].sort((a, b) => {
    if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
    }

    if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
    }
    if (sortBy === "incomplete-first") {
    return Number(a.is_completed) - Number(b.is_completed);
    }
    if (sortBy === "start-date-asc") {
    return (
        new Date(a.start_date).getTime() -
        new Date(b.start_date).getTime()
    );
    }
    if (sortBy === "start-date-desc") {
    return (
        new Date(b.start_date).getTime() -
        new Date(a.start_date).getTime()
    );
    }

    if (sortBy === "end-date-asc") {
        return (
            new Date(a.end_date).getTime() -
            new Date(b.end_date).getTime()
        );
    }

    if (sortBy === "end-date-desc") {
        return (
            new Date(b.end_date).getTime() -
            new Date(a.end_date).getTime()
        );
    }
    if (sortBy === "completed-first") {
    return Number(b.is_completed) - Number(a.is_completed);
    }
    if (sortBy === "order-asc") {
    return a.order - b.order;
    }

    if (sortBy === "order-desc") {
        return b.order - a.order;
    }
    return 0;
});
    const totalPages = Math.ceil(
        sortedCategoryTodos.length / todosPerPage
    );

    const startIndex = (currentPage - 1) * todosPerPage;

    const paginatedTodos = sortedCategoryTodos.slice(
        startIndex,
        startIndex + todosPerPage
    );
    useEffect(() => {
    setCurrentPage(1);
}, [searchTerm, statusFilter, dateFrom, dateTo, sortBy, categoryId]);
    useEffect(() => {
    if (currentPage > Math.max(totalPages, 1)) {
        setCurrentPage(Math.max(totalPages, 1));
    }
}, [currentPage, totalPages]); 
async function handleAddTodo() {
  if (!title.trim() || !selectedCategory || !categoryId) {
    return;
  }

    const newTodo = {
          title: title.trim(),
          description: description.trim(),
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          order: todos.length + 1,
        }
      try {
        console.log("Sending todo:", newTodo);
        const createdTodo = await postTodos(newTodo);
        console.log("New todo ID:", createdTodo.data._id);
        console.log("Created todo:", createdTodo);

        const assignmentResult = await assignTodosToCategory(
        categoryId,
        [createdTodo.data._id]
        );

        console.log("Assignment result:", assignmentResult);
        console.log("Category returned by API:", assignmentResult.data.todos);

        dispatch(addTodo(createdTodo.data));
        dispatch(updateCategory(assignmentResult.data));
        setTitle("");
        setDescription("");
  } catch (error) {
    console.error("Failed to create todo:", error);
}
}
    async  function handleTodoRemove(id:string){
      try{
        const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;
          await  deleteTodo(id)
          dispatch(removeTodo(id))
      }catch (error){
        console.error(error);
      }
    }

    function handleStartEditing(todo: (typeof todos)[number]) {
        setEditingTodoId(todo._id);
        setTitle(todo.title);
        setDescription(todo.description);
    }

    async function handleUpdateTodo(){
        if (!editingTodoId || !title.trim()) {
            return;
        }
        const existingTodo = todos.find(
            (todo) => todo._id === editingTodoId
        );
        if (!existingTodo) {
            return;
        }
        const updatedData = {
            title: title.trim(),
            description: description.trim(),
            start_date: existingTodo.start_date,
            end_date: existingTodo.end_date,
            is_completed: existingTodo.is_completed,
            order: existingTodo.order,
        };
        try {
            const result = await updateTodo(editingTodoId, updatedData);
            console.log("Update response:", result);
            dispatch(editTodo(result));
            setTitle("");
            setDescription("");
            setEditingTodoId(null);
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    }

    async function handleToggleTodo(todo: (typeof todos)[number]) {
    const updatedTodo = {
        ...todo,
        is_completed: !todo.is_completed,
    };

    try {
        await updateTodo(todo._id, updatedTodo);
        dispatch(toggleTodo(todo._id));
    } catch (error) {
        console.error("Failed to update todo status:", error);
    }
    }




    return (
  <main className="flex min-h-screen flex-col items-center bg-gray-950 px-4 pb-8 pt-16 text-white sm:px-6">
    {/* Back button */}
    <button
      className="absolute left-4 top-4 rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium transition hover:bg-violet-600 active:scale-95"
      onClick={() => navigate("/")}
    >
      Categories
    </button>

    {/* Category title */}
    <h1 className="mb-6 mt-2 break-words text-center text-2xl font-bold text-violet-400 sm:text-3xl">
      {selectedCategory?.name ?? "Category not found"}
    </h1>

    {/* Todo form */}
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <input
        className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Todo title"
      />

      <textarea
        className="w-full resize-y rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Todo description"
        rows={3}
      />

      <button
        className="w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 active:scale-[0.98] sm:w-auto sm:min-w-40"
        onClick={editingTodoId ? handleUpdateTodo : handleAddTodo}
      >
        {editingTodoId ? "Save Changes" : "Add Todo"}
      </button>
    </div>

    {/* Search */}
    <div className="mt-6 w-full max-w-2xl">
      <input
        className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by title or description..."
      />
    </div>

    {/* Filters */}
    <div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Date range */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h2 className="text-sm font-semibold text-violet-300">Date range</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="dateFrom" className="text-sm text-gray-400">
            From
          </label>
          <input
            className="w-full min-w-0 rounded-lg border border-gray-700 bg-gray-950 px-2 py-2 text-sm text-white outline-none transition focus:border-violet-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="dateTo" className="text-sm text-gray-400">
            To
          </label>
          <input
            className="w-full min-w-0 rounded-lg border border-gray-700 bg-gray-950 px-2 py-2 text-sm text-white outline-none transition focus:border-violet-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </div>
      </div>

      {/* Status and sorting */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="statusFilter" className="text-sm text-gray-400">
            Status
          </label>
          <select
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-500"
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All tasks</option>
            <option value="incomplete">Incomplete</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="sortBy" className="text-sm text-gray-400">
            Sort by
          </label>
          <select
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-500"
            id="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="title-asc">Title (A–Z)</option>
            <option value="title-desc">Title (Z–A)</option>
            <option value="incomplete-first">Incomplete first</option>
            <option value="start-date-asc">Start date (oldest first)</option>
            <option value="completed-first">Completed first</option>
            <option value="start-date-desc">Start date (newest first)</option>
            <option value="end-date-asc">End date (earliest first)</option>
            <option value="end-date-desc">End date (latest first)</option>
            <option value="order-asc">Order (lowest first)</option>
            <option value="order-desc">Order (highest first)</option>
          </select>
        </div>
      </div>
    </div>

    {/* Todo list */}
    <ul className="mt-6 flex w-full max-w-2xl flex-col gap-3">
      {paginatedTodos.map((todo) => (
        <li
          key={todo._id}
          onClick={() => navigate(`/todo/${todo._id}`)}
          className="flex min-w-0 cursor-pointer flex-wrap items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4 transition hover:border-violet-500/60 hover:bg-gray-900/80"
        >
          <input
            className="h-4 w-4 shrink-0 cursor-pointer accent-violet-500 border border-gray-300 rounded bg-gray-700"
            type="checkbox"
            checked={todo.is_completed}
            onClick={(event) => event.stopPropagation()}
            onChange={() => handleToggleTodo(todo)}
          />

          <div className="min-w-0 flex-1">
            <strong
              className={`block break-words text-sm font-semibold ${
                todo.is_completed
                  ? "text-gray-500 line-through"
                  : "text-white"
              }`}
            >
              {todo.title}
            </strong>
            <p className="mt-1 break-words text-sm leading-relaxed text-gray-400">
              {todo.description}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
              onClick={(event) => {
                event.stopPropagation();
                handleTodoRemove(todo._id);
              }}
            >
              Delete
            </button>

            <button
              className="rounded-lg border border-green-500/40 px-3 py-1.5 text-xs text-green-300 transition hover:bg-green-500/10"
              onClick={(event) => {
                event.stopPropagation();
                handleStartEditing(todo);
              }}
            >
              Edit
            </button>
          </div>
        </li>
      ))}
    </ul>

    {/* Pagination */}
    <div className="mt-6 flex items-center justify-center gap-4 text-sm">
      <button
        className="rounded-lg border border-gray-700 px-4 py-2 transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => setCurrentPage((page) => page - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span className="whitespace-nowrap text-gray-400">
        Page {currentPage} of {Math.max(totalPages, 1)}
      </span>

      <button
        className="rounded-lg border border-gray-700 px-4 py-2 transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => setCurrentPage((page) => page + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  </main>
);
}

export default CategoryTodosPage;