function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("api-key");
  localStorage.removeItem("logged-in-email");
  localStorage.removeItem("profile");
}

document.getElementById("logout").addEventListener("click", function (event) {
  event.preventDefault();
  logout();
  window.location.href = "/listings.html";
});
