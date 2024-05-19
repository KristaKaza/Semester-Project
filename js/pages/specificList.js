import { makeBid } from "../api/auth/listings.js/makeBid.js";
import { getPostDetails } from "../api/auth/listings.js/singlePost.js";
import { getProfileByName } from "../api/auth/profiles/profile.js";
import { getUserCredits } from "../api/auth/profiles/credits-api.js";

document.addEventListener("DOMContentLoaded", async function () {
  let postDetails;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    // Fetch the post details using postId
    postDetails = await getPostDetails(postId);
    displayPostDetails(postDetails);
    displayBids(postDetails.data.bids ?? []);

    const userName = localStorage.getItem("userName");
    if (userName) {
      try {
        const profile = await getProfileByName(userName);
        const sellerUsernameElement =
          document.getElementById("seller-username");
        if (sellerUsernameElement) {
          sellerUsernameElement.textContent = `Seller: ${profile.name}`;
        }
      } catch (profileError) {
        console.error("Error fetching profile data:", profileError);
        displayErrorMessage("Failed to fetch user profile details.");
      }
    }
  } catch (error) {
    console.error("Error fetching and displaying post details:", error);
    displayErrorMessage("Failed to load post details.");
  }

  // Add event listener for bid button
  document
    .querySelector(".btn-primary")
    .addEventListener("click", async function () {
      const bidInput = document.querySelector(".bid-container input");
      const bidAmount = Number(bidInput.value);

      // Clear previous error message
      const errorMessageElement = document.querySelector(
        ".bid-container .text-danger"
      );
      errorMessageElement.textContent = "";

      try {
        const userName = localStorage.getItem("userName");
        const userCredits = await getUserCredits(userName);

        // Check if bidAmount is greater than the last bid
        const lastBidAmount =
          postDetails.data.bids.length > 0
            ? postDetails.data.bids.slice(-1)[0].amount
            : 0;

        if (bidAmount <= lastBidAmount) {
          errorMessageElement.textContent =
            "Amount is not valid. Please bid more than the last bidder.";
          return;
        }

        if (bidAmount > userCredits.credits) {
          errorMessageElement.textContent =
            "You do not have enough credits for this bid.";
          return;
        }

        // Attempt to make the bid
        await makeBid(postDetails.data.id, bidAmount);
        // Fetch updated post details and display bids again
        postDetails = await getPostDetails(postDetails.data.id);
        displayBids(postDetails.data.bids);
        bidInput.value = "";
      } catch (error) {
        errorMessageElement.textContent = error.message;
      }
    });
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

    if (postDetails.data.media.length > 1) {
      // Create slider container
      const sliderContainer = document.createElement("div");
      sliderContainer.classList.add("slider-container");

      // Create slide track
      const slideTrack = document.createElement("div");
      slideTrack.classList.add("slide-track");

      // Create slides
      postDetails.data.media.forEach((media) => {
        const slide = document.createElement("div");
        slide.classList.add("slide");
        const mediaItem = document.createElement("img");
        mediaItem.setAttribute("src", media.url);
        mediaItem.setAttribute("alt", "Listing Image");
        mediaItem.classList.add("media-image");
        slide.appendChild(mediaItem);
        slideTrack.appendChild(slide);
      });

      // Append track to container
      sliderContainer.appendChild(slideTrack);

      // Create navigation buttons
      const prevButton = document.createElement("button");
      prevButton.classList.add("slider-button", "prev-button");
      prevButton.innerHTML = "&#10094;"; // Left arrow

      const nextButton = document.createElement("button");
      nextButton.classList.add("slider-button", "next-button");
      nextButton.innerHTML = "&#10095;"; // Right arrow

      sliderContainer.appendChild(prevButton);
      sliderContainer.appendChild(nextButton);

      mediaGallery.appendChild(sliderContainer);

      // Add event listeners for navigation buttons
      let currentIndex = 0;
      const slides = slideTrack.children;
      const totalSlides = slides.length;

      const showSlide = (index) => {
        slideTrack.style.transform = `translateX(-${index * 100}%)`;
      };

      prevButton.addEventListener("click", () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
        showSlide(currentIndex);
      });

      nextButton.addEventListener("click", () => {
        currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
        showSlide(currentIndex);
      });
    } else {
      const mediaItem = document.createElement("img");
      mediaItem.setAttribute("src", postDetails.data.media[0].url);
      mediaItem.setAttribute("alt", "Listing Image");
      mediaItem.classList.add("media-image");
      mediaGallery.appendChild(mediaItem);
    }

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
  const postDetailsContainer = document.getElementById(
    "post-details-container"
  );
  const existingBids = postDetailsContainer.querySelectorAll(".bid-wrapper");

  // Remove existing bids if any
  existingBids.forEach((bid) => bid.remove());

  const bidsCardBody = document.querySelector(".card-body");

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
