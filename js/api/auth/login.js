import { API_AUTH, API_BASE, API_KEY_URL, API_LOGIN } from "../../index.js";

// Function to save the accessToken in localStorage
function saveToken(accessToken) {
  localStorage.setItem("accessToken", accessToken);
}

// Function to check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

// Log in the user
export async function login(email, password) {
  if (!email.endsWith("@stud.noroff.no")) {
    alert("Only emails ending in @stud.noroff.no are allowed.");
    return false;
  }

  if (isLoggedIn()) {
    return true; // Already logged in
  }

  try {
    const loginResponse = await fetch(`${API_BASE}${API_AUTH}${API_LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      throw new Error("Login failed due to server error.");
    }

    const loginResponseJson = await loginResponse.json();
    const { accessToken, ...profile } = loginResponseJson.data;

    // Save the token and user details
    saveToken(accessToken);
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("logged-in-email", email);

    console.log("Login successful:", profile);

    // Optionally fetch and store the API key if needed
    await fetchApiKey(accessToken);

    return true;
  } catch (error) {
    alert("Login failed: " + error.message);
    return false;
  }
}

// Fetch and store API key if needed
async function fetchApiKey(accessToken) {
  const response = await fetch(`${API_BASE}${API_AUTH}${API_KEY_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name: "User API Key" }),
  });

  if (!response.ok) {
    console.error("Failed to fetch API key");
    return;
  }

  const apiKeyResponseJson = await response.json();
  localStorage.setItem("api-key", apiKeyResponseJson.data.key);
}

// Event listener for login form submission
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("signIn");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = event.target[0].value; // Assume email is the first input
      const password = event.target[1].value; // Assume password is the second input
      login(email, password).then((loggedIn) => {
        if (loggedIn) {
          window.location.href = "/listings.html";
        } else {
          alert("Invalid email or password. Please try again.");
        }
      });
    });
  }
});
