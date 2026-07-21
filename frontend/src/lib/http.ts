import { z } from "zod";

export const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

const ApiErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

async function parseError(resp: Response): Promise<never> {
  const body = await resp.json().catch(() => null);
  const parsed = ApiErrorSchema.safeParse(body);
  if (parsed.success) throw new ApiError(parsed.data.error.code, parsed.data.error.message);
  throw new ApiError("UNKNOWN", "The request could not be processed.");
}

export async function requestJson<T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>,
): Promise<T> {
  let resp: Response;
  try {
    resp = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError("NETWORK_ERROR", "Cannot connect to the server. Please check your network.");
  }
  if (!resp.ok) await parseError(resp);
  const body = await resp.json();
  return schema.parse(body);
}

export async function requestVoid(path: string, init: RequestInit): Promise<void> {
  let resp: Response;
  try {
    resp = await fetch(`${API_BASE}${path}`, init);
  } catch {
    throw new ApiError("NETWORK_ERROR", "Cannot connect to the server. Please check your network.");
  }
  if (!resp.ok) await parseError(resp);
}

// PUT bytes with upload progress (fetch has no upload-progress API).
export function putWithProgress(
  url: string,
  body: BlobPart,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new ApiError("STORAGE_ERROR", "File upload failed."));
    xhr.onerror = () =>
      reject(new ApiError("NETWORK_ERROR", "Cannot connect to the server. Please check your network."));
    xhr.send(body);
  });
}
