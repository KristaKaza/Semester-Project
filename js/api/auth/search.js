import { API_SEARCH, API_KEY } from "../../../index.js";
import { token } from "../../auth/token.js";

async function searchListings() {
  const query = document.getElementById("searchQuery").value;
  try {
    const listings = await getListingsFromSearch(query);
    console.log(listings);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
  }
}

async function getListingsFromSearch(query) {
  const url = API_SEARCH() + `?query=${query}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  });
  if (!response.ok) {
    throw new Error("Could not load posts");
  }
  const result = await response.json();
  return result.data;
}
