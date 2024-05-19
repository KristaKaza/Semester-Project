import { API_KEY, API_CREDITS } from "../../../index.js";
import { token } from "../../auth/token.js";

export async function getUserCredits(userName) {
  try {
    const response = await fetch(API_CREDITS(userName), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch credits by profile. Status: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    throw new Error(`Error fetching credits by profile: ${error.message}`);
  }
}
