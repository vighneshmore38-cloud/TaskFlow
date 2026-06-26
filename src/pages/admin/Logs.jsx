import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiUser } from "react-icons/fi";
import * as logService from "../../services/logService";
import { useToast } from "../../context/ToastContext";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { ErrorState } from "../../components/common/EmptyState";
import { getUserName, formatDate } from "../../utils/helpers";

export default function AdminLogs() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  async function loadLogs() {
    setLoading(true);
    setError(null);
    try {
      const data = await logService.getLogs();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      await logService.downloadLogs();
      showToast("Activity log downloaded as CSV", "success");
    } catch {
      showToast("Could not download the log file", "error");
    } finally {
      setIsDownloading(false);
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "User",
        accessorKey: "userId",
        cell: ({ row }) => (
          <span className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-[var(--color-primary)]">
              <FiUser className="h-3.5 w-3.5" />
            </span>
            {getUserName(row.original.userId)}
          </span>
        ),
      },
      { header: "Action", accessorKey: "action" },
      { header: "Task", accessorKey: "taskName" },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-[var(--color-ink-soft)]">{formatDate(row.original.date)}</span>
        ),
      },
      {
        header: "Time",
        accessorKey: "time",
        cell: ({ row }) => <span className="font-mono text-xs text-[var(--color-ink-soft)]">{row.original.time}</span>,
      },
    ],
    []
  );

  if (error) return <ErrorState message={error} onRetry={loadLogs} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-ink-soft)]">
          {logs.length} activity record{logs.length !== 1 ? "s" : ""}
        </p>
        <Button
          variant="secondary"
          icon={<FiDownload className="h-4 w-4" />}
          onClick={handleDownload}
          isLoading={isDownloading}
        >
          Download CSV
        </Button>
      </div>

      <Table
        columns={columns}
        data={logs}
        isLoading={loading}
        emptyTitle="No activity yet"
        emptyDescription="Actions like creating, assigning, or completing tasks will show up here."
        pageSize={8}
      />
    </div>
  );
}
