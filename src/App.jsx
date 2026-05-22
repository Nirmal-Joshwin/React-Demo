import { useState, useEffect } from "react";

const initialForm = { title: "", description: "", priority: "Medium", dueDate: "" };

function TaskForm({ onAdd }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    else if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters.";
    if (form.dueDate && new Date(form.dueDate) < new Date(new Date().toDateString()))
      e.dueDate = "Due date cannot be in the past.";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({ ...form, id: Date.now(), done: false, createdAt: new Date().toISOString() });
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div>
      <h2>Add New Task</h2>

      <div>
        <label>Task Title *</label><br />
        <input value={form.title} onChange={handleChange("title")} placeholder="Enter task title" />
        {errors.title && <p>{errors.title}</p>}
      </div>

      <div>
        <label>Description</label><br />
        <textarea value={form.description} onChange={handleChange("description")} placeholder="Optional description" rows={3} />
      </div>

      <div>
        <label>Priority</label><br />
        <select value={form.priority} onChange={handleChange("priority")}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div>
        <label>Due Date</label><br />
        <input type="date" value={form.dueDate} onChange={handleChange("dueDate")} />
        {errors.dueDate && <p>{errors.dueDate}</p>}
      </div>

      <br />
      <button onClick={handleSubmit}>Add Task</button>
    </div>
  );
}

function TaskItem({ task, onDelete, onToggle }) {
  return (
    <li>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
      {task.done ? <s>{task.title}</s> : task.title}
      {" "}[{task.priority}]
      {task.description && <span> — {task.description}</span>}
      {task.dueDate && <span> | Due: {task.dueDate}</span>}
      {" "}<button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}

function TaskList({ tasks, onDelete, onToggle }) {
  if (!tasks.length) return <p>No tasks added yet.</p>;
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </ul>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const pending = tasks.filter((t) => !t.done).length;
    document.title = pending ? `(${pending}) Task Manager` : "Task Manager";
  }, [tasks]);

  const addTask = (task) => setTasks((prev) => [task, ...prev]);
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const toggleTask = (id) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  const filteredTasks = tasks.filter((t) => {
    if (filter === "Active") return !t.done;
    if (filter === "Done") return t.done;
    return true;
  });

  return (
    <div>
      <h1>Task Manager</h1>

      <TaskForm onAdd={addTask} />

      <hr />

      <h2>Task List</h2>
      <p>Total: {tasks.length} | Done: {tasks.filter((t) => t.done).length} | Remaining: {tasks.filter((t) => !t.done).length}</p>

      <button onClick={() => setFilter("All")}>All</button>{" "}
      <button onClick={() => setFilter("Active")}>Active</button>{" "}
      <button onClick={() => setFilter("Done")}>Done</button>

      <TaskList tasks={filteredTasks} onDelete={deleteTask} onToggle={toggleTask} />
    </div>
  );
}