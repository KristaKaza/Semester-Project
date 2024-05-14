import { API_LISTINGS, API_KEY } from "../../../index.js";
export { getAllListings };

async function getAllListings(page = 1, perPage = 10) {
  const url = `${API_LISTINGS}?page=${page}&perPage=${perPage}`;
  const response = await fetch(url, {
    headers: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    },
  });
  if (!response.ok) {
    throw new Error("Could not load listings");
  }
  const result = await response.json();
  return result.data;
}
