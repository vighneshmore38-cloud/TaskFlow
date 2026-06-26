import { useEffect, useMemo, useState } from "react";
import { FiCheckSquare, FiCheckCircle, FiClock } from "react-icons/fi";
import * as taskService from "../../services/taskService";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { ErrorState, EmptyState } from "../../components/common/EmptyState";
import TaskCard from "../../components/common/TaskCard";
import MovableList from "../../components/common/MovableList";
import TaskViewModal from "../../components/common/TaskViewModal";
import { sortTasksForDisplay } from "../../utils/helpers";

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const all = await taskService.getTasks();
      setTasks(all.filter((t) => t.assignedTo === user.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [user.id]);

  const recentTasks = useMemo(() => sortTasksForDisplay(tasks).slice(0, 6), [tasks]);

  if (loading) return <Loader label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={loadTasks} />;

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card label="Assigned Tasks" value={tasks.length} icon={<FiCheckSquare />} accent="primary" />
        <Card label="Completed Tasks" value={completed} icon={<FiCheckCircle />} accent="success" />
        <Card label="Pending Tasks" value={pending} icon={<FiClock />} accent="warning" />
      </div>

      <div>
        <h2 className="mb-3 font-display font-semibold text-[var(--color-ink)]">Your tasks</h2>
        {recentTasks.length === 0 ? (
          <EmptyState
            title="Nothing's assigned to you yet"
            description="Check back soon, or create a task for yourself from My Tasks."
          />
        ) : (
          <MovableList
            items={recentTasks}
            getKey={(task) => task.id}
            className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
            renderItem={(task) => <TaskCard task={task} onView={setViewingTask} />}
          />
        )}
      </div>

      <TaskViewModal isOpen={Boolean(viewingTask)} onClose={() => setViewingTask(null)} task={viewingTask} />
    </div>
  );
}
