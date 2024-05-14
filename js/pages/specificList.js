import { makeBid } from "../api/auth/listings.js/makeBid.js";
import { getPostDetails } from "../api/auth/listings.js/singlePost.js";
import { fetchBidsByProfile } from "../api/auth/profiles/bidsByProfile.js";
import { getProfileByName } from "../api/auth/profiles/profile.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    // Fetch the post details using postId
    const postDetails = await getPostDetails(postId);
    displayPostDetails(postDetails);
    displayBids(postDetails);

    // Fetch the current user's profile to display username
    const userName = localStorage.getItem("userName");
    const profile = await getProfileByName(userName);
    const sellerUsernameElement = document.getElementById("seller-username");
    if (sellerUsernameElement) {
      sellerUsernameElement.textContent = `Seller: ${profile.name}`;
    } else {
      console.error("Seller username element not found");
    }
  } catch (error) {
    console.error("Error fetching and displaying post details:", error);
    displayErrorMessage("Failed to load post details.");
  }
});

function displayPostDetails(postDetails) {
  const postDetailsContainer = document.getElementById(
    "post-details-container"
  );
  postDetailsContainer.innerHTML = "";

  if (!postDetails) {
    displayErrorMessage("No post details found.");
    return;
  }

  const card = document.createElement("div");
  card.classList.add("card", "my-3");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Create elements to display post details
  const titleElement = document.createElement("h1");
  titleElement.classList.add("card-title");
  titleElement.textContent = postDetails.data.title;

  // Seller's Username
  const sellerUsername = document.createElement("p");
  sellerUsername.classList.add("card-text");
  sellerUsername.textContent = `Seller: ${
    postDetails.data.seller ? postDetails.data.seller.name : "Unknown Seller"
  }`;

  // Media Gallery
  if (postDetails.data.media && postDetails.data.media.length > 0) {
    const mediaGallery = document.createElement("div");
    mediaGallery.classList.add("media-gallery");

    postDetails.data.media.forEach((media) => {
      const mediaItem = document.createElement("img");
      mediaItem.setAttribute("src", media.url);
      mediaItem.setAttribute("alt", "Listing Image");
      mediaItem.classList.add("media-image");
      mediaGallery.appendChild(mediaItem);
    });

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("card-text");
    descriptionElement.textContent = postDetails.data.description;

    // Bid Count
    const bidCount = document.createElement("p");
    bidCount.classList.add("card-text");
    bidCount.textContent = `Bids: ${postDetails.data._count.bids}`;

    // Format deadline function
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

    // Deadline Date
    const deadlineDate = document.createElement("p");
    deadlineDate.classList.add("card-text");
    deadlineDate.textContent = `Ends at: ${formatDeadline(
      postDetails.data.endsAt
    )}`;

    // Append elements to the card body
    cardBody.appendChild(titleElement);
    cardBody.appendChild(sellerUsername);
    cardBody.appendChild(mediaGallery);
    cardBody.appendChild(descriptionElement);
    cardBody.appendChild(bidCount);
    cardBody.appendChild(deadlineDate);
    card.appendChild(cardBody);

    // Append card to the post details container
    postDetailsContainer.appendChild(card);

    // Create input box for bid amount
    const bidInput = document.createElement("input");
    bidInput.setAttribute("type", "number");
    bidInput.setAttribute("placeholder", "Enter bid amount");
    bidInput.classList.add("form-control", "mb-3");
    cardBody.appendChild(bidInput);

    // Create button for making the bid
    const bidButton = document.createElement("button");
    bidButton.textContent = "Make a Bid";
    bidButton.classList.add("btn", "btn-primary", "mb-3");
    bidButton.addEventListener("click", async function () {
      const bidAmount = Number(bidInput.value);
      if (!isNaN(bidAmount)) {
        try {
          await makeBid(postDetails.data.id, bidAmount);
        } catch (error) {
          console.error("Error making bid:", error);
          displayErrorMessage("Failed to make bid.");
        }
      } else {
        displayErrorMessage("Invalid bid amount. Please enter a valid number.");
      }
    });

    cardBody.appendChild(bidButton);
  }
}

/**
 * @param {{data: {bids: { amount: number, bidder: {name: string}}[]}}} response
 */
function displayBids(response) {
  if (response && response.data && response.data.bids) {
    // Extract bidder information
    console.log(response.data.bids);
    response.data?.bids?.forEach((bid) => {
      const bidElement = document.createElement("p");
      bidElement.classList.add("card-text");

      const bidderName = bid.bidder?.name;
      const bidAmount = bid.amount;

      if (bidderName && bidAmount) {
        bidElement.textContent = `Bidder: ${bidderName}, Amount: ${bidAmount}`;
      } else {
        bidElement.textContent = "Invalid bid data";
        console.error("Invalid bid data:", response);
      }
      // Find the card body within the post details container
      const cardBody = document.querySelector(
        "#post-details-container .card-body"
      );
      cardBody.appendChild(bidElement);
    });
  } else {
    console.error(
      "No bid data found in the response or bidder information is missing:",
      response
    );
  }
}

function displayErrorMessage(message) {
  const postDetailsContainer = document.getElementById(
    "post-details-container"
  );
  postDetailsContainer.innerHTML = "";

  const errorElement = document.createElement("p");
  errorElement.classList.add("card-text");
  errorElement.textContent = message;

  postDetailsContainer.appendChild(errorElement);
}
