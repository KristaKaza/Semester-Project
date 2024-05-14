// Function to save data to local storage
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Function to load data from local storage
export function load(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Function to save the access token to local storage
export function saveToken(token) {
  localStorage.setItem("token", token);
}

// Function to load the access token from local storage
export function loadToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  return localStorage.removeItem(token);
}

// Retrieve the access token when making API requests
export const token = loadToken();
