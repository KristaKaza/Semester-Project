import { API_AUTH, API_BASE, API_KEY_URL, API_LOGIN } from "../../index.js";
import { saveToken } from "../auth/token.js";

export async function login(email, password) {
  if (!email.endsWith("@stud.noroff.no")) {
    return false;
  }

  if (isLoggedIn(email)) {
    return true;
  }
  const loginResponse = await fetch(API_BASE + API_AUTH + API_LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  if (!loginResponse.ok) {
    return false;
  }
  const loginResponseJson = await loginResponse.json();
  const { accessToken, ...profile } = loginResponseJson.data;

  // Extract the username from the profile information
  const loggedInUsername = profile.name;

  localStorage.setItem("profile", JSON.stringify(profile));
  console.log({ accessToken });
  saveToken(accessToken);

  const apiKeyResponse = await fetch(API_BASE + API_AUTH + API_KEY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: "User api key",
    }),
  });
  const apiKeyResponseJson = await apiKeyResponse.json();
  const apiKey = apiKeyResponseJson.data.key;
  localStorage.setItem("api-key", apiKey);
  localStorage.setItem("logged-in-email", email);

  // Set the username in localStorage
  localStorage.setItem("userName", loggedInUsername);

  return true;
}

function isLoggedIn(email) {
  return localStorage.getItem("logged-in-email") === email;
}

//SIGN IN BUTTON
document.getElementById("signIn").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = event.target[0].value;
  const password = event.target[1].value;
  login(email, password).then((loggedIn) => {
    if (loggedIn) {
      window.location.href = "/html/listings.html";
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });
});

/* //IF USER IS ALREADY LOGGED IN, CAN GET RIGHT AWAY IN THE PROFILE.HTML WITHOUT LOGING IN AGAIN
window.addEventListener("load", () => {
  if (localStorage.getItem("logged-in-email")) {
    window.location.href = "/html/my-profile/index.html";
  }
}); */
