import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { taskSchema } from "../../utils/validationSchemas";
import { PRIORITY_OPTIONS, TYPE_OPTIONS } from "../../utils/constants";

/**
 * Used for both creating and editing a task.
 * `users` is passed in so the "Assign to" dropdown can list real people.
 */
export default function TaskFormModal({ isOpen, onClose, onSubmit, editingTask, users, isSaving }) {
  const isEdit = Boolean(editingTask);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      projectName: "",
      priority: "Medium",
      type: "General",
      date: "",
      time: "",
      assignedTo: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: editingTask?.title || "",
        description: editingTask?.description || "",
        projectName: editingTask?.projectName || "",
        priority: editingTask?.priority || "Medium",
        type: editingTask?.type || "General",
        date: editingTask?.date || "",
        time: editingTask?.time || "",
        assignedTo: editingTask?.assignedTo || "",
      });
    }
  }, [isOpen, editingTask, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit task" : "Create task"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input label="Title" placeholder="e.g. Fix login redirect bug" error={errors.title?.message} {...register("title")} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-ink)]">Description</label>
          <textarea
            rows={3}
            placeholder="What needs to be done?"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]/20"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-[var(--color-danger)]">{errors.description.message}</p>
          )}
        </div>

        <Input label="Project Name" placeholder="e.g. TaskFlow Core" error={errors.projectName?.message} {...register("projectName")} />

        <div className="grid grid-cols-2 gap-4">
          <Select label="Priority" error={errors.priority?.message} {...register("priority")}>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <Select label="Type" error={errors.type?.message} {...register("type")}>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <Input label="Time" type="time" error={errors.time?.message} {...register("time")} />
        </div>

        <Select label="Assign to" error={errors.assignedTo?.message} {...register("assignedTo")}>
          <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName}
            </option>
          ))}
        </Select>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEdit ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
