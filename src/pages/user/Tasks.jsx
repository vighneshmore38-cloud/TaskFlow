import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiPlus, FiTrash2 } from "react-icons/fi";
import * as taskService from "../../services/taskService";
import { recordActivity } from "../../services/logService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { ErrorState, EmptyState } from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import TaskViewModal from "../../components/common/TaskViewModal";
import TaskCard from "../../components/common/TaskCard";
import MovableList from "../../components/common/MovableList";
import SelfTaskFormModal from "../../components/user/SelfTaskFormModal";
import { sortTasksForDisplay } from "../../utils/helpers";

/**
 * Users can VIEW their own tasks, CREATE new tasks for themselves, and
 * COMPLETE their own tasks. There is no edit, delete, or assign handler
 * anywhere in this file — that capability simply isn't imported here.
 */
export default function UserTasks() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  // Sorted once per `tasks` change — this single line is what makes
  // "completed tasks move down, pending tasks come up" actually happen.
  const sortedTasks = useMemo(() => sortTasksForDisplay(tasks), [tasks]);

  async function handleComplete(task) {
    setCompletingId(task.id);
    try {
      await taskService.completeTask(task.id, user.id);
      recordActivity({ userId: user.id, action: "completed a task", taskId: task.id, taskName: task.title });
      showToast("Marked as completed", "success");
      loadTasks();
    } catch (err) {
      showToast(err.message || "Could not update task", "error");
    } finally {
      setCompletingId(null);
    }
  }

  // A user's own task is always assigned to AND created by themselves —
  // that's enforced here in code, not left to the form to decide.
  async function handleCreate(values) {
    setIsSaving(true);
    try {
      const created = await taskService.createTask({
        ...values,
        createdBy: user.id,
        assignedTo: user.id,
      });
      recordActivity({ userId: user.id, action: "created a task", taskId: created.id, taskName: created.title });
      showToast("Task created", "success");
      setCreateOpen(false);
      loadTasks();
    } catch (err) {
      showToast(err.message || "Could not create task", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // A user may only delete a task where THEY are the creator — a task an
  // admin assigned to them is not eligible, which is checked again below
  // in renderActions (the delete button never even renders otherwise).
  async function handleDeleteOwnTask() {
    setIsSaving(true);
    try {
      await taskService.deleteTask(deletingTask.id);
      recordActivity({ userId: user.id, action: "deleted a task", taskName: deletingTask.title });
      showToast("Task deleted", "success");
      setDeletingTask(null);
      loadTasks();
    } catch (err) {
      showToast(err.message || "Could not delete task", "error");
    } finally {
      setIsSaving(false);
    }
  }

  function renderActions(task) {
    const canComplete = task.status !== "Completed";
    const canDelete = task.createdBy === user.id; // self-created only

    if (!canComplete && !canDelete) return null;

    return (
      <>
        {canComplete && (
          <Button
            size="sm"
            variant="secondary"
            icon={<FiCheck className="h-3.5 w-3.5" />}
            isLoading={completingId === task.id}
            onClick={() => handleComplete(task)}
          >
            Mark complete
          </Button>
        )}
        {canDelete && (
          <button
            onClick={() => setDeletingTask(task)}
            className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-red-50 hover:text-[var(--color-danger)]"
            aria-label="Delete task"
            title="Delete this task (you created it)"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        )}
      </>
    );
  }

  if (error) return <ErrorState message={error} onRetry={loadTasks} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-ink-soft)]">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} assigned to you
        </p>
        <Button icon={<FiPlus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Create task
        </Button>
      </div>

      {loading ? (
        <Loader label="Loading your tasks..." />
      ) : sortedTasks.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="When your admin assigns you a task, or you create one for yourself, it'll show up here."
        />
      ) : (
        <MovableList
          items={sortedTasks}
          getKey={(task) => task.id}
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
          renderItem={(task) => (
            <TaskCard task={task} onView={setViewingTask} actions={renderActions(task)} />
          )}
        />
      )}

      <TaskViewModal isOpen={Boolean(viewingTask)} onClose={() => setViewingTask(null)} task={viewingTask} />

      <SelfTaskFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteOwnTask}
        title="Delete task"
        description={`This permanently removes "${deletingTask?.title}". This can't be undone.`}
        isLoading={isSaving}
      />
    </div>
  );
}
