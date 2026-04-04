import client from "./client";

// ─── Request Types ────────────────────────────────────────────────────────────

export interface CreateWorkerRequest {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
}

export interface ZoneAssignRequest {
  worker_id: string;
  primary: number;
  secondary: number[];
}

export interface UploadKYCRequest {
  worker_id: string;
  aadhaar_number: string;
  pan_number: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface CommonResponse {
  status: string;
  message: string;
  worker_id: string;
}

export interface Zone {
  zone_id: number;
  zone_name: string;
}

export interface ZonesResponse {
  primary: Zone[];
  secondary: Zone[];
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export const createWorker = async (
  data: CreateWorkerRequest,
): Promise<CommonResponse> => {
  const res = await client.post<CommonResponse>("/users/create-worker", data);
  return res.data;
};

export const assignZone = async (
  data: ZoneAssignRequest,
): Promise<CommonResponse> => {
  const res = await client.post<CommonResponse>("/users/register-zone", data);
  return res.data;
};

export const uploadKYC = async (
  data: UploadKYCRequest,
): Promise<CommonResponse> => {
  const res = await client.post<CommonResponse>("/users/upload-kyc", data);
  return res.data;
};

// Fetch primary zones — falls back to mock data if route doesn't exist yet
export const getPrimaryZones = async (): Promise<Zone[]> => {
  try {
    const res = await client.get<Zone[]>("/users/primary-zones");
    return res.data;
  } catch {
    // Graceful fallback mock data
    return [
      { zone_id: 1, zone_name: "Mumbai" },
      { zone_id: 2, zone_name: "Delhi" },
      { zone_id: 3, zone_name: "Bengaluru" },
      { zone_id: 4, zone_name: "Hyderabad" },
      { zone_id: 5, zone_name: "Chennai" },
      { zone_id: 6, zone_name: "Kolkata" },
      { zone_id: 7, zone_name: "Pune" },
      { zone_id: 8, zone_name: "Ahmedabad" },
      { zone_id: 9, zone_name: "Jaipur" },
      { zone_id: 10, zone_name: "Lucknow" },
    ];
  }
};

// Fetch secondary zones — falls back to mock data if route doesn't exist yet
export const getSecondaryZones = async (): Promise<Zone[]> => {
  try {
    const res = await client.get<Zone[]>("/users/secondary-zones");
    return res.data;
  } catch {
    // Graceful fallback mock data
    return [
      { zone_id: 1, zone_name: "Mumbai" },
      { zone_id: 2, zone_name: "Delhi" },
      { zone_id: 3, zone_name: "Bengaluru" },
      { zone_id: 4, zone_name: "Hyderabad" },
      { zone_id: 5, zone_name: "Chennai" },
      { zone_id: 6, zone_name: "Kolkata" },
      { zone_id: 7, zone_name: "Pune" },
      { zone_id: 8, zone_name: "Ahmedabad" },
      { zone_id: 9, zone_name: "Jaipur" },
      { zone_id: 10, zone_name: "Lucknow" },
    ];
  }
};
