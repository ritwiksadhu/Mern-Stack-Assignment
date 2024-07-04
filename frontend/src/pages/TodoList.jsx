import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTodo, getTodos } from "../services/rest";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 10;

  const fetchTodos = async ({ page, limit, search }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await getTodos(
        {
          headers: {
            "x-auth-token": token,
          },
        },
        page,
        limit,
        search
      );
      setTodos(response.data.todos);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos({ page, limit, search });
  }, [page]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await deleteTodo(id, limit, {
        headers: {
          "x-auth-token": token,
        },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      if (error.response) {
        console.error("Failed to delete with status:", error.response.status);
        console.error("Error data:", error.response.data.error);
      } else if (error.request) {
        console.error("Failed to delete: No response received");
        console.error("Error request:", error.request);
      } else {
        console.error("Failed to delete:", error.message);
      }
    }
  };

  function searchTodos(e) {
    e.preventDefault();
    fetchTodos({ page: 1, limit, search });
  }

  return (
    <div className="container mt-5">
      {todos.length > 0 && (
        <form className="input-group" onSubmit={searchTodos}>
          <input
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="btn btn-outline-secondary">
            <i className={" bi-search"}></i>
          </button>
        </form>
      )}
      <h2>Todo List</h2>
      <Link to="/todo" className="btn btn-primary mb-3">
        Create Todo
      </Link>
      <ul className="list-group">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="content flex-grow-1">
              <h5
                className={
                  "w-100 text-center" + (todo.completed ? " completed" : "")
                }
              >
                {todo.title}
              </h5>
              <p
                className={
                  "w-100 text-center" + (todo.completed ? " completed" : "")
                }
              >
                {todo.description}
              </p>
            </div>
            <div className="btn_group">
              <Link
                to={`/todo?id=${todo._id}`}
                className="btn btn-warning me-2"
              >
                Edit
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(todo._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {todos.length > 0 && totalPages > 0 && total > 10 && (
        <div className="mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
