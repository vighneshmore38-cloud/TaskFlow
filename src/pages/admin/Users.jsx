import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers as FiUsersIcon } from "react-icons/fi";
import * as userService from "../../services/userService";
import * as groupService from "../../services/groupService";
import { recordActivity } from "../../services/logService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { ErrorState } from "../../components/common/EmptyState";
import UserFormModal from "../../components/admin/UserFormModal";
import GroupManagerModal from "../../components/admin/GroupManagerModal";
import { roleBadge } from "../../utils/constants";
import { formatDate, getGroupName } from "../../utils/helpers";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const [groupManagerOpen, setGroupManagerOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [userList, groupList] = await Promise.all([
        userService.getUsers(),
        groupService.getGroups(),
      ]);
      setUsers(userList);
      setGroups(groupList);
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
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEditForm(user) {
    setEditingUser(user);
    setFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setIsSaving(true);
    // Normalize the <select>'s "" (No group) to null, so it matches the
    // seed data's convention and getGroupName()'s "no group at all" case.
    const payload = { ...values, groupId: values.groupId || null };
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, payload);
        recordActivity({ userId: currentUser.id, action: "edited a user", taskName: payload.fullName });
        showToast("User updated successfully", "success");
      } else {
        await userService.createUser(payload);
        recordActivity({ userId: currentUser.id, action: "created a user", taskName: payload.fullName });
        showToast("User created successfully", "success");
      }
      setFormOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || "Could not save user", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    setIsSaving(true);
    try {
      await userService.deleteUser(deletingUser.id);
      recordActivity({
        userId: currentUser.id,
        action: "deleted a user",
        taskName: deletingUser.fullName,
      });
      showToast("User deleted", "success");
      setDeletingUser(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Could not delete user", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateGroup(name) {
    setIsSavingGroup(true);
    try {
      const created = await groupService.createGroup(name);
      recordActivity({ userId: currentUser.id, action: "created a group", taskName: created.name });
      showToast(`"${created.name}" group created`, "success");
      loadData();
    } catch (err) {
      showToast(err.message || "Could not create group", "error");
    } finally {
      setIsSavingGroup(false);
    }
  }

  async function handleDeleteGroupConfirm() {
    setIsSavingGroup(true);
    try {
      await groupService.deleteGroup(deletingGroup.id);
      recordActivity({ userId: currentUser.id, action: "deleted a group", taskName: deletingGroup.name });
      showToast("Group deleted", "success");
      setDeletingGroup(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Could not delete group", "error");
    } finally {
      setIsSavingGroup(false);
    }
  }

  const columns = useMemo(
    () => [
      { header: "Username", accessorKey: "fullName" },
      { header: "Email", accessorKey: "email" },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => (
          <Badge text={row.original.role} className={roleBadge[row.original.role]} />
        ),
      },
      {
        header: "Group",
        accessorKey: "groupId",
        cell: ({ row }) => (
          <span className="text-[var(--color-ink-soft)]">{getGroupName(row.original.groupId)}</span>
        ),
      },
      {
        header: "Created Date",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-[var(--color-ink-soft)]">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => openEditForm(row.original)}
              className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-primary)]"
              aria-label="Edit user"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeletingUser(row.original)}
              className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-red-50 hover:text-[var(--color-danger)]"
              aria-label="Delete user"
              disabled={row.original.id === currentUser.id}
              title={row.original.id === currentUser.id ? "You can't delete your own account" : "Delete"}
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [currentUser.id]
  );

  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-ink-soft)]">
          {users.length} user{users.length !== 1 ? "s" : ""} in your workspace
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={<FiUsersIcon className="h-4 w-4" />}
            onClick={() => setGroupManagerOpen(true)}
          >
            Manage groups
          </Button>
          <Button icon={<FiPlus className="h-4 w-4" />} onClick={openCreateForm}>
            Create user
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={users}
        isLoading={loading}
        emptyTitle="No users yet"
        emptyDescription="Create your first user to get them set up with access."
      />

      <UserFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
        groups={groups}
        onManageGroups={() => setGroupManagerOpen(true)}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete user"
        description={`This permanently removes ${deletingUser?.fullName} and unassigns any tasks they hold. This can't be undone.`}
        isLoading={isSaving}
      />

      <GroupManagerModal
        isOpen={groupManagerOpen}
        onClose={() => setGroupManagerOpen(false)}
        groups={groups}
        onCreate={handleCreateGroup}
        onRequestDelete={setDeletingGroup}
        isSaving={isSavingGroup}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingGroup)}
        onClose={() => setDeletingGroup(null)}
        onConfirm={handleDeleteGroupConfirm}
        title="Delete group"
        description={`This removes "${deletingGroup?.name}". Members keep their group id on record but it'll show as "Unknown group" until you reassign them.`}
        isLoading={isSavingGroup}
      />
    </div>
  );
}
