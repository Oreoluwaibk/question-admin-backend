const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export type DeletionInfo = {
  appName: string;
  supportEmail: string;
  processingDays: number;
  deletedData: string[];
  retainedData: string[];
};

export async function fetchDeletionInfo(): Promise<DeletionInfo> {
  const response = await fetch(`${API_URL}/account-deletion/info`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Could not load deletion information");
  }

  return response.json();
}

export async function submitDeletionRequest(payload: {
  email: string;
  reason?: string;
}) {
  const response = await fetch(`${API_URL}/account-deletion/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Could not submit deletion request");
  }

  return data as {
    message: string;
    requestId: string;
    alreadyPending?: boolean;
  };
}
