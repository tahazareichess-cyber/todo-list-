
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

function TodoDetailsPage() {
  const { todoId } = useParams();

  const todos = useAppSelector((state) => state.todos.todos);

  const todo = todos.find((item) => item._id === todoId);

  const navigate = useNavigate();

  if (!todo) {
    return (
      <main>
        <h1>Todo not found</h1>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </main>
    );
  }

  return (
  <main className="flex min-h-screen flex-col items-center bg-gray-950 px-4 py-10 text-white sm:px-6">
    <div className="w-full max-w-2xl">
      
      <button
        onClick={() => navigate(-1)}
        className="mb-8 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-violet-500 hover:text-violet-300 active:scale-95"
      >
        ← Go Back
      </button>

      <div className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gray-900 shadow-xl shadow-violet-500/5">
        
        <div className="border-b border-gray-800 p-6 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            Task Details
          </span>

          <h1 className="mt-3 break-words text-2xl font-bold tracking-tight sm:text-3xl">
            {todo.title}
          </h1>

          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-gray-400 sm:text-base">
            {todo.description || "No description provided."}
          </p>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-950 p-4">
            <span className="text-sm text-gray-400">Status</span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                todo.is_completed
                  ? "bg-green-500/10 text-green-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {todo.is_completed ? "Completed" : "Not completed"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-xs font-medium text-gray-500">Start date</p>
              <p className="mt-2 break-words text-sm font-semibold text-gray-200">
                {todo.start_date || "Not set"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-xs font-medium text-gray-500">End date</p>
              <p className="mt-2 break-words text-sm font-semibold text-gray-200">
                {todo.end_date || "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950 p-4">
            <span className="text-sm text-gray-400">Order</span>
            <span className="rounded-lg bg-violet-500/10 px-3 py-1 text-sm font-bold text-violet-300">
              {todo.order}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}

export default TodoDetailsPage;
