import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUpdateTodo, getTodo } from "../services/rest";

const TodoUpdate = () => {
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  const [todoData, setTodoData] = useState({});

  useEffect(() => {
    if (id) {
      const fetchTodo = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await getTodo(id, {
            headers: {
              "x-auth-token": token,
            },
          });
          setTodoData(response.data.todo);
        } catch (error) {
          console.error("Failed to fetch todo:", error);
          if (error.response) {
            console.error(
              "Failed to fetch todo with status:",
              error.response.status
            );
            console.error("Error data:", error.response.data.error);
          } else if (error.request) {
            console.error("Failed to fetch todo: No response received");
            console.error("Error request:", error.request);
          } else {
            console.error("Failed to fetch todo:", error.message);
          }
        }
      };
      fetchTodo();
    }
  }, [id]);

  const handleCreateUpdateTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await createUpdateTodo(todoData, {
        headers: {
          "x-auth-token": token,
        },
      });
      navigate("/"); // Redirect to todo list after successful update or create
    } catch (error) {
      console.error("Failed to create or update todo:", error);
    }
  };

  function handleChangeTodoData(e) {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setTodoData({ ...todoData, [name]: newValue });
  }

  return (
    <div className="container mt-5">
      <form
        className="mb-3 d-flex flex-column align-items-center"
        onSubmit={handleCreateUpdateTodo}
      >
        <input
          type="text"
          name="title"
          className="form-control mb-2"
          placeholder="Enter todo title"
          value={todoData.title || ""}
          onChange={handleChangeTodoData}
          required
        />
        <textarea
          name="description"
          className="form-control mb-2"
          placeholder="Enter todo description"
          value={todoData.description || ""}
          onChange={handleChangeTodoData}
          required
        />
        <label>
          Completed
          <input
            name="completed"
            type="checkbox"
            className="mb-2 ms-2"
            checked={todoData.completed || false}
            onChange={handleChangeTodoData}
          />
        </label>
        <button className="btn btn-primary">
          {id ? "Update " : "Add "}
          Todo
        </button>
      </form>
    </div>
  );
};

export default TodoUpdate;
