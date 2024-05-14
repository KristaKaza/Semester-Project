import { API_KEY, API_BID } from "../../../index.js";
import { token } from "../../auth/token.js";

export async function makeBid(postId, bidAmount, listingId) {
  try {
    const response = await fetch(API_BID(postId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: bidAmount,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to make bid");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error making bid: ${error.message}`);
  }
}
