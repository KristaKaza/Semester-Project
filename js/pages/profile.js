import { loadToken } from "../api/auth/token.js";
import { getProfileByName } from "../api/auth/profiles/profile.js";
import { getUserListings } from "../api/auth/listings.js/myListings.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (!profile || !profile.name) {
      throw new Error("No userName found in profile");
    }
    const userName = profile.name;
    const token = loadToken();

    if (!token) {
      throw new Error("No token found");
    }

    const profileData = await getProfileByName(userName);
    displayProfile(profileData);

    const listings = await getUserListings(userName);
    displayListings(listings);
  } catch (error) {
    console.error("Error fetching and displaying profile:", error);
  }
});

function displayProfile(profile) {
  const profileContainer = document.getElementById("profile-container");
  profileContainer.innerHTML = "";

  // Profile Image
  if (profile.avatar && profile.avatar.url) {
    const profileImage = document.createElement("img");
    profileImage.setAttribute("src", profile.avatar.url);
    profileImage.setAttribute("alt", "Profile Image");
    profileImage.classList.add("profile-image");
    profileContainer.appendChild(profileImage);
  }

  // Username
  const usernameElement = document.createElement("h2");
  usernameElement.textContent = profile.name;
  profileContainer.appendChild(usernameElement);

  // Edit Profile Link
  const editProfileLink = document.createElement("a");
  editProfileLink.setAttribute("href", "/html/updateProfile.html");
  editProfileLink.classList.add("link", "text-secondary");
  editProfileLink.textContent = "Edit your profile";
  profileContainer.appendChild(editProfileLink);

  // Credits
  const creditsElement = document.createElement("p");
  creditsElement.textContent = `Credits: ${profile.credits}`;
  profileContainer.appendChild(creditsElement);
}

function displayListings(listings) {
  const listingsContainer = document.getElementById("my-listings-container");
  listingsContainer.innerHTML = "";

  listings.forEach((listing) => {
    const listingItem = document.createElement("div");
    listingItem.classList.add("col-md-4", "col-sm-6", "mb-4");

    listingItem.innerHTML = `
      <div class="card h-100">
        <img src="${
          listing.media[0]?.url || "default-image.jpg"
        }" class="card-img-top" alt="${listing.title}">
        <div class="card-body">
          <h5 class="card-title">${listing.title}</h5>
          <p class="card-text">${listing.description}</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Ends at: ${formatDeadline(
            listing.endsAt
          )}</small>
        </div>
      </div>
    `;

    listingItem.addEventListener("click", () => {
      window.location.href = `/html/singlePost.html?id=${
        listing.id
      }&title=${encodeURIComponent(listing.title)}`;
    });

    listingsContainer.appendChild(listingItem);
  });
}

function generateMediaGallery(media) {
  if (!media || media.length === 0) return "";

  // Generate HTML for each media item
  const mediaItems = media.map((item) => {
    return `<img src="${item.url}" alt="${item.alt}" class="media-image">`;
  });
  return mediaItems.join("");
}

function formatDeadline(dateString) {
  const deadline = new Date(dateString);
  const options = {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return deadline.toLocaleDateString("en-US", options);
}
