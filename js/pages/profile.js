import { getProfileByName } from "../api/auth/profiles/profile.js";
import { getUserListings } from "../api/auth/listings.js/myListings.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const userName = localStorage.getItem("userName");

    const profile = await getProfileByName(userName);
    displayProfile(profile);

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

// Define formatDeadline function
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

// Rest of the code
function displayListings(listings) {
  const listingsContainer = document.getElementById("my-listings-container");
  listingsContainer.innerHTML = "";

  listings.forEach((listing) => {
    const listingItem = document.createElement("div");
    listingItem.classList.add(
      "col-md-5",
      "col-sm-10",
      "m-2",
      "my-listing-item"
    );
    listingItem.innerHTML = `
      <h3>${listing.title}</h3>
      <div class="listing-details">
        <div class="listing-media">
          ${generateMediaGallery(listing.media)}
        </div>
        <div class="listing-description">
          <p>${listing.description}</p>
          <p>Bids: ${listing._count.bids}</p>
          <p>Ends at: ${formatDeadline(listing.endsAt)}</p>
        </div>
      </div>
    `;
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
