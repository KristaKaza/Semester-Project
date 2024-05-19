import { API_SEARCH, API_KEY } from "../../index.js";
import { loadToken } from "../auth/token.js";

// Function to search listings
export async function searchListings(query) {
  const token = loadToken();

  const url = API_SEARCH(query);
  console.log("Searching listings with URL:", url);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch search results");
  }

  const result = await response.json();
  return result.data;
}
