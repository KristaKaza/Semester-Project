import { getAllListings } from "../api/auth/listings.js/listings-api.js";
import { getProfileByName } from "../api/auth/profiles/profile.js";

document.addEventListener("DOMContentLoaded", async function () {
  let page = 1;
  const perPage = 10;
  const loadMoreButton = document.getElementById("load-more-button");

  loadMoreButton.addEventListener("click", async () => {
    try {
      const listings = await getAllListings(page++, perPage);
      if (listings.length > 0) {
        displayListings(listings);
      } else {
        loadMoreButton.disabled = true;
      }
    } catch (error) {
      console.error("Error fetching and displaying listings:", error);
    }
  });

  // Initial load
  loadMoreButton.click();
});

async function displayListings(listings) {
  const listingsContainer = document.getElementById("listings-container");
  listingsContainer.innerHTML = "";
  listingsContainer.classList.add("row");

  listings.forEach(async (listing) => {
    const postCard = document.createElement("div");
    postCard.classList.add("col-md-5", "col-sm-10", "m-2");
    postCard.addEventListener("click", () => {
      window.location.href = `/html/singlePost.html?id=${listing.id}&title=${listing.title}`;
    });
    listingsContainer.appendChild(postCard);

    const cardInner = document.createElement("div");
    cardInner.classList.add("card", "card-body");
    postCard.appendChild(cardInner);
    cardInner.style.cursor = "pointer";

    // Title
    const title = document.createElement("h2");
    title.classList.add("title");
    title.innerHTML = listing.title;
    cardInner.appendChild(title);

    // Deadline Date
    const deadlineDate = document.createElement("p");
    deadlineDate.innerHTML = `Ends at: ${formatDeadline(listing.endsAt)}`;
    cardInner.appendChild(deadlineDate);

    // Media Gallery
    if (listing.media && listing.media.length > 0) {
      const mediaGallery = document.createElement("div");
      mediaGallery.classList.add("media-gallery");

      listing.media.forEach((media) => {
        const mediaItem = document.createElement("img");
        mediaItem.setAttribute("src", media.url);
        mediaItem.setAttribute("alt", media.alt);
        mediaItem.classList.add("media-image");
        mediaGallery.appendChild(mediaItem);
      });

      cardInner.appendChild(mediaGallery);
    }

    // Description
    const description = document.createElement("p");
    description.innerHTML = listing.description;
    cardInner.appendChild(description);

    // Bid Count
    const bidCount = document.createElement("p");
    bidCount.innerHTML = `Bids: ${listing._count.bids}`;
    cardInner.appendChild(bidCount);

    // View More Button
    const viewMoreButton = document.createElement("button");
    viewMoreButton.classList.add("btn", "btn-secondary");
    viewMoreButton.innerHTML = "View More";
    viewMoreButton.addEventListener("click", () => {
      window.location.href = `/html/singlePost.html?id=${listing.id}&title=${listing.title}`;
    });
    cardInner.appendChild(viewMoreButton);

    // Display the username
    const seller = document.createElement("p");
    seller.classList.add("name");

    // Extract the username from the listing data
    const username = listing.username;
    if (username) {
      try {
        // Fetch the profile using the extracted username
        const profile = await getProfileByName(username);
        seller.textContent = ` ${profile.userName}`;
      } catch (error) {
        console.error("Error fetching profile:", error);
        seller.textContent = "Unknown";
      }
    } else {
      seller.textContent = "Unknown";
    }
    cardInner.appendChild(seller);
  });
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
