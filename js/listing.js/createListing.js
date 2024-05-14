import { loadToken, token } from ".././api/auth/token.js";
import { API_KEY, API_CREATE_LISTING, API_BASE } from "../index.js";

const createListingModal = document.getElementById("createListingModal");
const openCreateListingModalBtn = document.getElementById(
  "openCreateListingModalBtn"
);
const closeCreateListingModalBtn = document.querySelector(
  "#createListingModal .close"
);
const cancelCreateListingBtn = document.getElementById(
  "cancelCreateListingBtn"
);

openCreateListingModalBtn.addEventListener("click", function () {
  createListingModal.style.display = "block";
});

closeCreateListingModalBtn.addEventListener("click", function () {
  createListingModal.style.display = "none";
});

cancelCreateListingBtn.addEventListener("click", function () {
  createListingModal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target === createListingModal) {
    createListingModal.style.display = "none";
  }
});

// Get the form element
const createListingForm = document.getElementById("createListingForm");

/// Add submit event listener to the form
createListingForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    // Get form data
    const title = document.getElementById("listingTitle").value;
    const deadline = document.getElementById("listingDeadline").value;
    const description = document.getElementById("listingDescription").value;
    const imageUrl = document.getElementById("listingImageInput").value;
    const token = loadToken();

    // Construct JSON object for the listing data
    const listingData = {
      title: title,
      description: description || "",
      media: imageUrl ? [{ url: imageUrl }] : [],
      endsAt: deadline,
    };

    console.log("Listing Data:", listingData);

    // Send listing data to server
    const response = await fetch(API_BASE + API_CREATE_LISTING, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingData),
    });

    console.log("Response:", response);

    if (response.ok) {
      console.log("Listing created successfully!");
      createListingModal.style.display = "none";
    } else {
      console.error("Failed to create listing:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating listing:", error);
  }
});
