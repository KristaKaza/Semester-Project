import { API_KEY, API_BID } from "../../../index.js";
import { token } from "../../auth/token.js";

export async function makeBid(postId, bidAmount) {
  const url = API_BID(postId);
  const payload = JSON.stringify({ amount: bidAmount });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to make bid";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error making bid: ${error.message}`);
  }
}
