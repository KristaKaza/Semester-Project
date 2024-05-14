import { API_SINGLE_LISTING, API_KEY } from "../../../index.js";
import { token } from "../../auth/token.js";

export async function getPostDetails(postId) {
  try {
    const response = await fetch(API_SINGLE_LISTING(postId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch post details (status ${response.status})`
      );
    }
    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch post details: ${error.message}`);
  }
}
