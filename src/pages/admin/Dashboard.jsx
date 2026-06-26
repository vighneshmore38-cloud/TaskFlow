import { useEffect, useMemo, useState } from "react";
import { FiUsers, FiCheckSquare, FiCheckCircle, FiClock } from "react-icons/fi";
import * as userService from "../../services/userService";
import * as taskService from "../../services/taskService";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { ErrorState, EmptyState } from "../../components/common/EmptyState";
import TaskCard from "../../components/common/TaskCard";
import MovableList from "../../components/common/MovableList";
import TaskViewModal from "../../components/common/TaskViewModal";
import { getUserName, sortTasksForDisplay } from "../../utils/helpers";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [userList, taskList] = await Promise.all([
        userService.getUsers(),
        taskService.getTasks(),
      ]);
      setUsers(userList);
      setTasks(taskList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Same sort used everywhere else — pending/in-progress first, completed
  // last — then capped to a handful for the dashboard preview.
  const recentTasks = useMemo(() => sortTasksForDisplay(tasks).slice(0, 6), [tasks]);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total Users" value={users.length} icon={<FiUsers />} accent="primary" />
        <Card label="Total Tasks" value={tasks.length} icon={<FiCheckSquare />} accent="accent" />
        <Card label="Completed Tasks" value={completed} icon={<FiCheckCircle />} accent="success" />
        <Card label="Pending Tasks" value={pending} icon={<FiClock />} accent="warning" />
      </div>

      <div>
        <h2 className="mb-3 font-display font-semibold text-[var(--color-ink)]">Recent tasks</h2>
        {recentTasks.length === 0 ? (
          <EmptyState title="No tasks yet" description="Tasks you create will show up here." />
        ) : (
          <MovableList
            items={recentTasks}
            getKey={(task) => task.id}
            className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
            renderItem={(task) => (
              <TaskCard
                task={task}
                onView={setViewingTask}
                metaLabel={`Assigned to ${getUserName(task.assignedTo)}`}
              />
            )}
          />
        )}
      </div>

      <TaskViewModal isOpen={Boolean(viewingTask)} onClose={() => setViewingTask(null)} task={viewingTask} />
    </div>
  );
}
