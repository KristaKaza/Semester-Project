import { API_KEY, API_BID_PROFILE } from "../../../index.js";
import { token } from "../../auth/token.js";

export async function fetchBidsByProfile(profileName) {
  try {
    const response = await fetch(`${API_BID_PROFILE}/${profileName}/bids`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch bids by profile. Status: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    throw new Error(`Error fetching bids by profile: ${error.message}`);
  }
}
