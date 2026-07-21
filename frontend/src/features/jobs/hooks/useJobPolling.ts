import { getJob, type JobDetail } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const TERMINAL = new Set(["COMPLETED", "FAILED", "CANCELLED"]);

export function useJobPolling(jobId: string | undefined) {
  return useQuery<JobDetail>({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId as string),
    enabled: !!jobId,
    // Poll until the job reaches a terminal state (spec 10.4).
    refetchInterval: (query) =>
      query.state.data && TERMINAL.has(query.state.data.status) ? false : 1000,
  });
}
