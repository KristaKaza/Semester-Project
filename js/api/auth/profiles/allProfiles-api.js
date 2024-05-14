import { API_ALL_PROFILES, API_KEY } from "../../../index.js";
export { getAllProfiles };

async function getAllProfiles() {
  const response = await fetch(API_ALL_PROFILES, {
    headers: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${"token"}`,
      },
    },
  });
  if (!response.ok) {
    throw new Error("Could not load listings");
  }
  const result = await response.json();
  return result.data;
}
