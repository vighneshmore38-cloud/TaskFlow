import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import * as taskService from "../../services/taskService";
import * as userService from "../../services/userService";
import { recordActivity } from "../../services/logService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { ErrorState } from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import TaskFormModal from "../../components/admin/TaskFormModal";
import AssignTaskModal from "../../components/admin/AssignTaskModal";
import TaskViewModal from "../../components/common/TaskViewModal";
import TaskBoard from "../../components/common/TaskBoard";
import ColumnVisibilityMenu from "../../components/common/ColumnVisibilityMenu";
import { useBoardPreferences } from "../../hooks/useBoardPreferences";
import { getUserName, groupTasksByUser } from "../../utils/helpers";

export default function AdminTasks() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [assigningTask, setAssigningTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [taskList, userList] = await Promise.all([
        taskService.getTasks(),
        userService.getUsers(),
      ]);
      setTasks(taskList);
      setUsers(userList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setIsSaving(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, values);
        recordActivity({ userId: currentUser.id, action: "edited a task", taskId: editingTask.id, taskName: values.title });
        showToast("Task updated successfully", "success");
      } else {
        const created = await taskService.createTask({ ...values, createdBy: currentUser.id });
        recordActivity({ userId: currentUser.id, action: "created a task", taskId: created.id, taskName: created.title });
        showToast("Task created successfully", "success");
      }
      setFormOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || "Could not save task", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAssign(taskId, assigneeId) {
    setIsSaving(true);
    try {
      const updated = await taskService.assignTask(taskId, assigneeId);
      recordActivity({ userId: currentUser.id, action: "assigned a task", taskId, taskName: updated.title });
      showToast(`Assigned to ${getUserName(assigneeId)}`, "success");
      setAssigningTask(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Could not assign task", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    setIsSaving(true);
    try {
      await taskService.deleteTask(deletingTask.id);
      recordActivity({ userId: currentUser.id, action: "deleted a task", taskName: deletingTask.title });
      showToast("Task deleted", "success");
      setDeletingTask(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Could not delete task", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // Splits the flat task list into one array per user — this is what
  // gives each person their own vertical column in the board below.
  const boardGroups = useMemo(() => groupTasksByUser(tasks, users), [tasks, users]);

  // The full set of possible columns (unfiltered) — used both to build
  // the "Columns" menu and as the reference list the preferences hook
  // checks new ids against.
  const allColumns = useMemo(
    () => boardGroups.map((g) => ({ id: g.userId, name: g.userName })),
    [boardGroups]
  );
  const allColumnIds = useMemo(() => allColumns.map((c) => c.id), [allColumns]);

  // This admin's OWN saved order + hidden list — independent of what any
  // other admin or user has chosen.
  const boardPrefs = useBoardPreferences(currentUser.id, allColumnIds);

  // Apply that preference to the actual groups TaskBoard will render:
  // re-order by `orderedIds`, then drop anything in `hiddenIds`.
  const visibleGroups = useMemo(() => {
    const byId = new Map(boardGroups.map((g) => [g.userId, g]));
    return boardPrefs.orderedIds
      .filter((id) => !boardPrefs.hiddenIds.includes(id))
      .map((id) => byId.get(id))
      .filter(Boolean);
  }, [boardGroups, boardPrefs.orderedIds, boardPrefs.hiddenIds]);

  function renderActions(task) {
    return (
      <>
        <button
          onClick={() => setViewingTask(task)}
          className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-primary)]"
          aria-label="View task"
        >
          <FiEye className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setEditingTask(task);
            setFormOpen(true);
          }}
          className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-primary)]"
          aria-label="Edit task"
        >
          <FiEdit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => setAssigningTask(task)}
          className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-primary)]"
          aria-label="Assign task"
        >
          <FiUserPlus className="h-4 w-4" />
        </button>
        <button
          onClick={() => setDeletingTask(task)}
          className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-red-50 hover:text-[var(--color-danger)]"
          aria-label="Delete task"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </>
    );
  }

  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-ink-soft)]">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} across all projects
        </p>
        <div className="flex items-center gap-2">
          <ColumnVisibilityMenu
            columns={allColumns}
            hiddenIds={boardPrefs.hiddenIds}
            onToggle={boardPrefs.toggleHidden}
            onShowAll={boardPrefs.showAll}
          />
          <Button icon={<FiPlus className="h-4 w-4" />} onClick={openCreateForm}>
            Create task
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading tasks..." />
      ) : (
        <TaskBoard
          groups={visibleGroups}
          onView={setViewingTask}
          renderActions={renderActions}
          getMetaLabel={(task) => `Created by ${getUserName(task.createdBy)}`}
          onMoveToFront={boardPrefs.moveToFront}
          onMoveToBack={boardPrefs.moveToBack}
          onHide={boardPrefs.toggleHidden}
          emptyColumnLabel="No tasks assigned yet"
        />
      )}

      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingTask={editingTask}
        users={users}
        isSaving={isSaving}
      />

      <TaskViewModal isOpen={Boolean(viewingTask)} onClose={() => setViewingTask(null)} task={viewingTask} />

      <AssignTaskModal
        isOpen={Boolean(assigningTask)}
        onClose={() => setAssigningTask(null)}
        onAssign={handleAssign}
        task={assigningTask}
        users={users}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete task"
        description={`This permanently removes "${deletingTask?.title}". This can't be undone.`}
        isLoading={isSaving}
      />
    </div>
  );
}
