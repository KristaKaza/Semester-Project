import { API_AUTH, API_BASE, API_REGISTER } from "../../index.js";

// REGISTER BUTTON
document
  .getElementById("register")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;

    try {
      const registered = await register(name, email, password);
      if (registered) {
        // Redirect to login page upon successful registration
        window.location.href = "/html/login.html";
      } else {
        // Hide any previous error messages
        document.getElementById("error-message").style.display = "none";
      }
    } catch (error) {
      // Display error message for invalid email
      document.getElementById("error-message").innerText = error.message;
      document.getElementById("error-message").style.display = "block";
    }
  });

// REGISTER FUNCTION
export async function register(name, email, password) {
  if (!email.endsWith("@stud.noroff.no")) {
    throw new Error(
      "Only email addresses ending in @stud.noroff.no are allowed for registration"
    );
  }

  if (isRegistered(email)) {
    return true;
  }

  const response = await fetch(API_BASE + API_AUTH + API_REGISTER, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
      name: name,
    }),
  });

  if (response.ok) {
    const responseData = await response.json();
    const { accessToken, ...profile } = responseData.data;

    console.log("User successfully registered:", name, email);

    localStorage.setItem("userName", name);
    localStorage.setItem(`${email}-registered`, true);

    return true;
  } else {
    console.error("Registration failed:", response.statusText);
    return false;
  }
}

function isRegistered(email) {
  return localStorage.getItem(`${email}-registered`) ? true : false;
}

export async function onAuth(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  if (event.submitter.dataset.auth === "login") {
    await login(email, password);
  } else {
    await register(name, email, password);
    await login(email, password);
  }
}

export function setAuthListener() {
  document.forms.auth.addEventListener("submit", onAuth);
}
