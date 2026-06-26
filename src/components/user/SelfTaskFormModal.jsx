import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { selfTaskSchema } from "../../utils/validationSchemas";
import { PRIORITY_OPTIONS, TYPE_OPTIONS } from "../../utils/constants";

/**
 * A user's own "create task" form. Notice there is NO assignedTo field at
 * all in this form — unlike the admin's TaskFormModal. The page that uses
 * this (pages/user/Tasks.jsx) fills in assignedTo/createdBy itself using
 * the logged-in user's id before calling the service. The form simply
 * can't submit a different assignee, because the field doesn't exist here.
 */
export default function SelfTaskFormModal({ isOpen, onClose, onSubmit, isSaving }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(selfTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      projectName: "",
      priority: "Medium",
      type: "General",
      date: "",
      time: "",
    },
  });

  function submitHandler(values) {
    onSubmit(values);
    reset();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a task for yourself" size="lg">
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4" noValidate>
        <Input label="Title" placeholder="e.g. Read onboarding docs" error={errors.title?.message} {...register("title")} />

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

        <Input label="Project Name" placeholder="e.g. Personal" error={errors.projectName?.message} {...register("projectName")} />

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

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
