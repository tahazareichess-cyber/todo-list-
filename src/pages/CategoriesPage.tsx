import { useEffect,useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link } from "react-router-dom";
import { createCategory, deleteCategory, editCategory } from "../api/categoriesApi";
import { setCategories, removeCategory, updateCategory } from "../features/categoriesSlice";


function CategoriesPage() {
    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 6;
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");

    const categories = useAppSelector(
    (state) => state.categories.categories
    );

  async function handleCreateCategory(){
        if(categoryName.trim() === "" )return;
        const newCategory = {
        name: categoryName.trim(),
        description: categoryDescription.trim(),
        todos:[],
        }
        try {
      const createCategorys = await createCategory(newCategory); 
      dispatch(setCategories([
        ...categories,
      createCategorys.data
      ]))
        setCategoryName("");
        setCategoryDescription(""); 
      console.log(createCategorys);
        } catch(error){
            console.error(error)
        }
    }



function handleStartEditing(category: (typeof categories)[number]) {
    setEditingCategoryId(category._id);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
}

async function handleUpdateCategory() {
    if (!editingCategoryId || !categoryName.trim()) {
        return;
    }

    const existingCategory = categories.find(
        (category) => category._id === editingCategoryId
    );

    if (!existingCategory) {
        return;
    }

    const updatedData = {
        name: categoryName.trim(),
        description: categoryDescription.trim(),
        todos: existingCategory.todos.map((todo) =>
            typeof todo === "string" ? todo : todo._id
        ),
    };

    try {
        const result = await editCategory(editingCategoryId, updatedData);
        dispatch(updateCategory(result));

        setCategoryName("");
        setCategoryDescription("");
        setEditingCategoryId(null);
    } catch (error) {
        console.error("Failed to update category:", error);
    }
}
const totalPages = Math.ceil(categories.length / categoriesPerPage);

const startIndex = (currentPage - 1) * categoriesPerPage;

const paginatedCategories = categories.slice(
  startIndex,
  startIndex + categoriesPerPage
);


useEffect(() => {
  const maxPage = Math.max(1, Math.ceil(categories.length / categoriesPerPage));

  if (currentPage > maxPage) {
    setCurrentPage(maxPage);
  }
}, [categories.length, currentPage]);



async function handleDeleteCategory(id: string) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
        await deleteCategory(id);
        dispatch(removeCategory(id));
    } catch (error) {
        console.error("Failed to delete category:", error);
    }
}


  return (
  <main className="min-h-screen bg-gray-950 text-white">
    <h1 className="px-4 py-10 text-center text-3xl font-bold tracking-tight text-violet-400 sm:text-4xl">
      My Categories
    </h1>

    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-5">
      <input
        value={categoryName}
        onChange={(event) => setCategoryName(event.target.value)}
        placeholder="Category name"
        className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
      />

      <textarea
        value={categoryDescription}
        onChange={(event) => setCategoryDescription(event.target.value)}
        placeholder="Category description"
        rows={3}
        className="w-full resize-y rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
      />

      <button
        onClick={
          editingCategoryId ? handleUpdateCategory : handleCreateCategory
        }
        className="rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 active:scale-[0.98]"
      >
        {editingCategoryId ? "Save Changes" : "Add Category"}
      </button>
    </div>

    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {paginatedCategories.map((category) => (
        <div
          key={category._id}
          className="min-w-0"
        >
          <div className="relative flex h-60 flex-col items-center justify-evenly gap-4 overflow-hidden rounded-2xl border border-violet-500/30 bg-gray-900 p-5 shadow-lg shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/70 hover:shadow-xl hover:shadow-violet-500/20">
            <i className="fa-solid fa-list-check absolute left-4 top-4 text-xl text-violet-400" />

            <Link
              to={`/category/${category._id}`}
              className="flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-3 pt-6"
            >
              <h2 className="w-full break-words text-center text-lg font-semibold">
                {category.name}
              </h2>

              <p className="line-clamp-3 w-full break-words text-center text-sm leading-relaxed text-gray-400">
                {category.description}
              </p>
            </Link>

            <div className="flex w-full justify-evenly gap-3">
              <button
                className="rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                onClick={() => handleDeleteCategory(category._id)}
              >
                Delete
              </button>

              <button
                className="rounded-lg border border-gree-400 px-4 py-2 text-sm text-green-400 transition hover:bg-green-500/10"
                onClick={() => handleStartEditing(category)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="flex items-center justify-center gap-4 pb-8">
  <button
    onClick={() => setCurrentPage((page) => page - 1)}
    disabled={currentPage === 1}
    className="rounded-lg border border-gray-700 px-4 py-2 text-sm transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
  >
    Previous
  </button>

  <span className="text-sm text-gray-400">
    Page {currentPage} of {Math.max(totalPages, 1)}
  </span>

  <button
    onClick={() => setCurrentPage((page) => page + 1)}
    disabled={currentPage >= totalPages}
    className="rounded-lg border border-gray-700 px-4 py-2 text-sm transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
  >
    Next
  </button>
</div>
  </main>
);
}

export default CategoriesPage;