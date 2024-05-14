import { API_MY_LISTINGS, API_KEY } from "../../../index.js";
import { load, loadToken } from "../../auth/token.js";

async function getMyListings(page = 1, perPage = 10) {
  const token = load("token");

  const url = `${API_MY_LISTINGS}?page=${page}&perPage=${perPage}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Could not load listings");
  }
  const result = await response.json();
  return result.data;
}

export { getMyListings };

export async function getUserListings(userName) {
  const token = loadToken();

  const response = await fetch(API_MY_LISTINGS(userName), {
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch user listings");
  }

  const result = await response.json();
  return result.data;
}
