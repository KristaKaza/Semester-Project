import { API_MY_PROFILE, API_KEY } from "../../../index.js";
import { loadToken } from "../../auth/token.js";

export async function getProfileByName(userName) {
  const token = loadToken();

  const response = await fetch(API_MY_PROFILE(userName), {
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
