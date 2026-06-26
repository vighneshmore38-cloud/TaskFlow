import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { getUserSchema } from "../../utils/validationSchemas";
import { ROLE_OPTIONS } from "../../utils/constants";

/**
 * Used for BOTH creating and editing a user.
 * `editingUser` is null for create mode, or a user object for edit mode —
 * the form pre-fills and the password field becomes optional in edit mode.
 *
 * `groups` is the live list from groupService.getGroups() — passed in by
 * the page, not fetched here, so this component stays a "dumb" form.
 * `onManageGroups` opens GroupManagerModal without closing this one, so
 * an admin can create a missing group without losing what they've typed.
 */
export default function UserFormModal({ isOpen, onClose, onSubmit, editingUser, groups, onManageGroups, isSaving }) {
  const isEdit = Boolean(editingUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getUserSchema(isEdit)),
    defaultValues: { fullName: "", email: "", password: "", role: "user", groupId: "" },
  });

  // Re-sync the form whenever the modal opens for a different user (or for "create").
  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: editingUser?.fullName || "",
        email: editingUser?.email || "",
        password: "",
        role: editingUser?.role || "user",
        groupId: editingUser?.groupId || "",
      });
    }
  }, [isOpen, editingUser, reset]);

  function submitHandler(values) {
    // Don't send an empty password through on edit (means "keep current password").
    if (isEdit && !values.password) {
      delete values.password;
    }
    onSubmit(values);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit user" : "Create user"}>
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Full Name"
          placeholder="e.g. Priya Sharma"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="name@taskflow.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label={isEdit ? "New Password (leave blank to keep current)" : "Password"}
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Select label="Role" error={errors.role?.message} {...register("role")}>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--color-ink)]">Group</label>
            <button
              type="button"
              onClick={onManageGroups}
              className="text-xs font-medium text-[var(--color-primary)] hover:underline"
            >
              + Manage groups
            </button>
          </div>
          <Select error={errors.groupId?.message} {...register("groupId")}>
            <option value="">No group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEdit ? "Save changes" : "Create user"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
