import { getProfileByName } from "../api/auth/profiles/profile.js";
import { updateProfileImage } from "../api/auth/profiles/updateProfile.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const userName = localStorage.getItem("userName");

    const profile = await getProfileByName(userName);
    displayProfile(profile);

    // Populate profile image input with current profile image URL
    const profileImageInput = document.getElementById("profileImageInput");
    if (profile.avatar && profile.avatar.url) {
      profileImageInput.value = profile.avatar.url;
    }
  } catch (error) {
    console.error("Error fetching and displaying profile:", error);
  }
});

document
  .getElementById("applyBtn")
  .addEventListener("click", async function () {
    try {
      const userName = localStorage.getItem("userName");
      const newAvatarUrl = document.getElementById("profileImageInput").value;

      // Send updated data to server
      await updateProfileImage(userName, newAvatarUrl);

      const updatedProfile = await getProfileByName(userName);
      displayProfile(updatedProfile);

      // Display message underneath the credits
      displaySuccessMessage("Profile image updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile image. Please try again.");
    }
  });

document.getElementById("cancelBtn").addEventListener("click", function () {
  window.location.href = "/html/myProfile.html";
});

function displayProfile(profile) {
  const profileContainer = document.getElementById("profile-container");

  // Clear previous content
  profileContainer.innerHTML = "";

  // Check if the profile has an image
  if (profile.avatar && profile.avatar.url) {
    const profileImage = document.createElement("img");
    profileImage.setAttribute("src", profile.avatar.url);
    profileImage.setAttribute("alt", "Profile Image");
    profileImage.classList.add("profile-image");
    profileContainer.appendChild(profileImage);
  }

  // Display username
  const usernameElement = document.createElement("h2");
  usernameElement.textContent = profile.name;
  profileContainer.appendChild(usernameElement);

  // Add link to edit profile
  const editProfileLink = document.createElement("a");
  editProfileLink.setAttribute("href", "/html/updateProfile.html");
  editProfileLink.classList.add("link", "text-secondary");
  editProfileLink.textContent = "Edit your profile";
  profileContainer.appendChild(editProfileLink);

  // Display credits
  const creditsElement = document.createElement("p");
  creditsElement.textContent = `Credits: ${profile.credits}`;
  profileContainer.appendChild(creditsElement);

  // Append container for success message
  const successMessageContainer = document.createElement("div");
  successMessageContainer.setAttribute("id", "successMessage");
  profileContainer.appendChild(successMessageContainer);
}

function displaySuccessMessage(message) {
  const successMessageContainer = document.getElementById("successMessage");
  successMessageContainer.textContent = message;
}
