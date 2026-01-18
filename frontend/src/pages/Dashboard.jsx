import React, { useEffect, useState } from "react";
import { taskAPI } from "../services/api";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = Boolean(editingTaskId);

  /* ---------------------------- LOAD TASKS ---------------------------- */

  const handleTaskLoading = async () => {
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleTaskLoading();
  }, []);

  /* -------------------------- CREATE / UPDATE -------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskPayload = { title, description };

      if (isEditing) {
        await taskAPI.updateTask(editingTaskId, taskPayload);
      } else {
        await taskAPI.createTask(taskPayload);
      }

      resetForm();
      handleTaskLoading();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  /* ------------------------------- EDIT ------------------------------- */

  const handleTaskUpdation = (task) => {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setErrorMessage("");
  };

  /* ------------------------------- DELETE ------------------------------- */

  const handleTaskDeletion = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      if (editingTaskId === taskId) {
        resetForm();
      }
      handleTaskLoading();
    } catch (error) {
      console.error(error);
    }
  };

  /* ------------------------------- UI ------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Todoist
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Manage your daily flow
            </p>
          </div>
          <div className="hidden md:block text-right text-sm text-gray-400 font-semibold uppercase tracking-widest">
            {tasks.length} tasks remaining
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-5">
                {isEditing ? "Edit Task" : "Quick Add"}
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Study DSA"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Break down the steps..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-xs font-medium italic">
                    {errorMessage}
                  </p>
                )}

                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
                    >
                      Update Task
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
                  >
                    Add Task
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Task List */}
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task._id}
                    className="group bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </h3>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed ml-5">
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-100 cursor-pointer"
                        onClick={() => handleTaskUpdation(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                        onClick={() => handleTaskDeletion(task._id)}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-400 font-medium">
                    Your list is clear. Relax!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
