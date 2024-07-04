import Todo from "../models/todo_model.js";

export const createTodo = async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
      created_by: req.user.id,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search;
  try {
    const searchObj = { created_by: req.user.id };

    if (search) {
      searchObj.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const todos = await Todo.find(searchObj)
      .sort({ updated_at: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Todo.countDocuments(searchObj);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      total,
      page,
      totalPages,
      todos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodo = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "No Id Provided" });
  }
  try {
    const todo = await Todo.findOne({ _id: id, created_by: req.user.id });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      todo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, created_by: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const limit = req.query.limit;
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id,
      created_by: req.user.id,
    });
    const total = await Todo.countDocuments({ created_by: req.user.id });
    const totalPages = Math.ceil(total / limit);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res
      .status(200)
      .json({ message: "Todo deleted successfully", total, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
