import { useEffect, useMemo, useState } from "react";
import * as taskService from "../../services/taskService";
import * as userService from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import { ErrorState } from "../../components/common/EmptyState";
import TaskViewModal from "../../components/common/TaskViewModal";
import TaskBoard from "../../components/common/TaskBoard";
import ColumnVisibilityMenu from "../../components/common/ColumnVisibilityMenu";
import { useBoardPreferences } from "../../hooks/useBoardPreferences";
import { getUserName, getGroupName, groupTasksByUser } from "../../utils/helpers";

/** Strictly read-only: no `renderActions` is passed to TaskBoard at all. */
export default function UserAllTasks() {
  const { user: currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

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

  // The whole point of this feature: a user only ever sees people who
  // share THEIR group, not the whole company. If they aren't in a group
  // at all, fall back to just themselves rather than showing everyone.
  const groupMembers = useMemo(() => {
    if (!currentUser.groupId) {
      return users.filter((u) => u.id === currentUser.id);
    }
    return users.filter((u) => u.groupId === currentUser.groupId);
  }, [users, currentUser.groupId, currentUser.id]);

  // One column per group member — built from the FILTERED list above, so
  // groupTasksByUser never even creates a column for anyone outside the
  // group; their tasks simply don't appear, rather than being hidden by
  // a UI toggle. We also drop the "Unassigned" bucket groupTasksByUser
  // adds — those tasks belong to no one yet, not specifically to this
  // group, so they don't belong on a group-scoped view.
  const boardGroups = useMemo(
    () => groupTasksByUser(tasks, groupMembers).filter((g) => g.userId !== "unassigned"),
    [tasks, groupMembers]
  );

  const allColumns = useMemo(
    () => boardGroups.map((g) => ({ id: g.userId, name: g.userName })),
    [boardGroups]
  );
  const allColumnIds = useMemo(() => allColumns.map((c) => c.id), [allColumns]);

  // This logged-in user's OWN saved order + hidden list — independent of
  // what the admin or any other user has chosen for themselves.
  const boardPrefs = useBoardPreferences(currentUser.id, allColumnIds);

  const visibleGroups = useMemo(() => {
    const byId = new Map(boardGroups.map((g) => [g.userId, g]));
    return boardPrefs.orderedIds
      .filter((id) => !boardPrefs.hiddenIds.includes(id))
      .map((id) => byId.get(id))
      .filter(Boolean);
  }, [boardGroups, boardPrefs.orderedIds, boardPrefs.hiddenIds]);

  const visibleTaskCount = boardGroups.reduce((sum, g) => sum + g.tasks.length, 0);

  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-ink-soft)]">
          {currentUser.groupId ? (
            <>
              {visibleTaskCount} task{visibleTaskCount !== 1 ? "s" : ""} within your group
            </>
          ) : (
            <>
              {visibleTaskCount} task{visibleTaskCount !== 1 ? "s" : ""} — you're not in a group yet, showing only your own
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <ColumnVisibilityMenu
            columns={allColumns}
            hiddenIds={boardPrefs.hiddenIds}
            onToggle={boardPrefs.toggleHidden}
            onShowAll={boardPrefs.showAll}
          />
          {currentUser.groupId && (
            <Badge
              text={getGroupName(currentUser.groupId)}
              className="bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
            />
          )}
          <Badge text="Read-only" className="bg-slate-100 text-slate-500 ring-1 ring-slate-200" />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading tasks..." />
      ) : (
        <TaskBoard
          groups={visibleGroups}
          onView={setViewingTask}
          getMetaLabel={(task) => `Created by ${getUserName(task.createdBy)}`}
          onMoveToFront={boardPrefs.moveToFront}
          onMoveToBack={boardPrefs.moveToBack}
          onHide={boardPrefs.toggleHidden}
          emptyColumnLabel="No tasks"
        />
      )}

      <TaskViewModal isOpen={Boolean(viewingTask)} onClose={() => setViewingTask(null)} task={viewingTask} />
    </div>
  );
}
