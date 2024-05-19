import { API_MY_PROFILE, API_KEY } from "../../../index.js";
import { loadToken } from "../token.js";

export async function getProfileByName(userName) {
  const token = loadToken();

  // Log the URL and Headers for debugging
  const url = API_MY_PROFILE(userName);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch profile");
  }

  const result = await response.json();
  return result.data;
}
