import { makeBid } from "../api/auth/listings.js/makeBid.js";
import { getPostDetails } from "../api/auth/listings.js/singlePost.js";
import { getProfileByName } from "../api/auth/profiles/profile.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    // Fetch the post details using postId
    const postDetails = await getPostDetails(postId);
    displayPostDetails(postDetails);
    displayBids(postDetails.data.bids ?? []);

    // Fetch the current user's profile to display username
    const userName = localStorage.getItem("userName");

    if (userName) {
      const profile = await getProfileByName(userName);
      const sellerUsernameElement = document.getElementById("seller-username");

      // Check if seller username element exists
      if (sellerUsernameElement) {
        sellerUsernameElement.textContent = `Seller: ${profile.name}`;
      }
    } else {
      console.error("Failed to retrieve username from localStorage");
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
    cardBody.appendChild(mediaGallery);
  }

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

  // Create container for bid input, button, and error message
  const bidContainer = document.createElement("div");
  bidContainer.classList.add("bid-container");

  // Create input box for bid amount
  const bidInput = document.createElement("input");
  bidInput.setAttribute("type", "number");
  bidInput.setAttribute("placeholder", "Enter bid amount");
  bidInput.classList.add("form-control", "mb-3");
  bidContainer.appendChild(bidInput);

  // Create button for making the bid
  const bidButton = document.createElement("button");
  bidButton.textContent = "Make a Bid";
  bidButton.classList.add("btn", "btn-primary", "mb-3");
  bidContainer.appendChild(bidButton);

  // Error message element
  const errorMessageElement = document.createElement("p");
  errorMessageElement.classList.add("card-text", "text-danger");
  bidContainer.appendChild(errorMessageElement);

  // Add event listener for bid button
  bidButton.addEventListener("click", async function () {
    const bidAmount = Number(bidInput.value);

    // Clear previous error message
    errorMessageElement.textContent = "";

    // Check if bidAmount is a valid number
    if (!isNaN(bidAmount)) {
      // Check if auction has ended
      const currentTime = new Date();
      const auctionEndTime = new Date(postDetails.data.endsAt);
      if (currentTime > auctionEndTime) {
        errorMessageElement.textContent =
          "This auction has ended so you can no longer make a bid";
        return;
      }

      // Check if bidAmount is greater than the last bid
      const lastBidAmount =
        postDetails.data.bids.length > 0
          ? postDetails.data.bids.slice(-1)[0].amount
          : 0;
      if (bidAmount <= lastBidAmount) {
        errorMessageElement.textContent =
          "The amount of your bid is not enough. Please bid more than the last bid for this auction";
        return;
      }

      // Make the bid if all checks pass
      try {
        const response = await makeBid(postDetails.data.id, bidAmount);
        displayBids(response.data.bids);
        bidInput.value = "";
      } catch (error) {
        console.error("Error making bid:", error);
        errorMessageElement.textContent = "Failed to make bid.";
      }
    } else {
      errorMessageElement.textContent =
        "Invalid bid amount. Please enter a valid number.";
    }
  });

  // Append elements to the card body
  cardBody.appendChild(titleElement);
  cardBody.appendChild(sellerUsername);
  cardBody.appendChild(bidCount);
  cardBody.appendChild(deadlineDate);
  cardBody.appendChild(bidContainer);
  card.appendChild(cardBody);
  postDetailsContainer.appendChild(card);
}

/**
 * @param {{ amount: number, bidder: {name: string}}[]} bids
 */
function displayBids(bids) {
  const bidsContainer = document.createElement("div");
  bidsContainer.classList.add("card", "my-3");

  const bidsCardBody = document.createElement("div");
  bidsCardBody.classList.add("card-body");

  const bidsTitle = document.createElement("h2");
  bidsTitle.classList.add("card-title");
  bidsTitle.textContent = "Bids";

  bidsCardBody.appendChild(bidsTitle);

  // Extract bidder information
  bids.forEach((bid) => {
    const bidWrapper = document.createElement("div");
    bidWrapper.classList.add("bid-wrapper", "mb-2", "p-2", "border", "rounded");

    const bidElement = document.createElement("div");
    bidElement.classList.add("d-flex", "justify-content-between", "p-2");

    const bidderName = bid.bidder?.name;
    const bidAmount = bid.amount;

    if (bidderName && bidAmount) {
      const bidderNameElement = document.createElement("span");
      bidderNameElement.textContent = `Bidder: ${bidderName}`;

      const bidAmountElement = document.createElement("span");
      bidAmountElement.textContent = `Amount: ${bidAmount}`;

      bidElement.appendChild(bidderNameElement);
      bidElement.appendChild(bidAmountElement);
    } else {
      bidElement.textContent = "Invalid bid data";
      console.error("Invalid bid data:", bid);
    }

    bidWrapper.appendChild(bidElement);
    bidsCardBody.appendChild(bidWrapper);
  });

  bidsContainer.appendChild(bidsCardBody);
  const postDetailsContainer = document.getElementById(
    "post-details-container"
  );
  postDetailsContainer.appendChild(bidsContainer);
}

function displayErrorMessage(message) {
  const postDetailsContainer = document.getElementById(
    "post-details-container"
  );
  postDetailsContainer.innerHTML = "";

  const errorElement = document.createElement("p");
  errorElement.classList.add("card-text", "text-danger");
  errorElement.textContent = message;

  postDetailsContainer.appendChild(errorElement);
}