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
      { zone_id: 1, zone_name: "North Zone" },
      { zone_id: 2, zone_name: "South Zone" },
      { zone_id: 3, zone_name: "East Zone" },
      { zone_id: 4, zone_name: "West Zone" },
      { zone_id: 5, zone_name: "Central Zone" },
      { zone_id: 101, zone_name: "Sector A" },
      { zone_id: 102, zone_name: "Sector B" },
      { zone_id: 103, zone_name: "Sector C" },
      { zone_id: 104, zone_name: "Sector D" },
      { zone_id: 105, zone_name: "Sector E" },
      { zone_id: 106, zone_name: "Sector F" },
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
      { zone_id: 1, zone_name: "North Zone" },
      { zone_id: 2, zone_name: "South Zone" },
      { zone_id: 3, zone_name: "East Zone" },
      { zone_id: 4, zone_name: "West Zone" },
      { zone_id: 5, zone_name: "Central Zone" },
      { zone_id: 101, zone_name: "Sector A" },
      { zone_id: 102, zone_name: "Sector B" },
      { zone_id: 103, zone_name: "Sector C" },
      { zone_id: 104, zone_name: "Sector D" },
      { zone_id: 105, zone_name: "Sector E" },
      { zone_id: 106, zone_name: "Sector F" },
    ];
  }
};
