import { getAllListings } from "../api/auth/listings.js/listings-api.js";
import { searchListings } from "../api/auth/search.js";

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

  loadMoreButton.click();

  // Add search functionality
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const query = document.getElementById("searchQuery").value;
      try {
        const listings = await searchListings(query);
        displayListings(listings);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    });
  }
});

function displayListings(listings) {
  const listingsContainer = document.getElementById("listings-container");
  listingsContainer.innerHTML = "";
  listingsContainer.classList.add(
    "row",
    "row-cols-1",
    "row-cols-md-2",
    "row-cols-lg-3",
    "g-3"
  );

  for (const listing of listings) {
    const postCard = document.createElement("div");
    postCard.classList.add("col");
    listingsContainer.appendChild(postCard);

    const cardInner = document.createElement("div");
    cardInner.classList.add("card", "card-body");
    postCard.appendChild(cardInner);

    // Title
    const title = document.createElement("h2");
    title.classList.add("title");
    title.innerHTML = listing.title;
    cardInner.appendChild(title);

    // Media Gallery
    const mediaGallery = document.createElement("div");
    mediaGallery.classList.add("media-gallery");

    if (listing.media && listing.media.length > 1) {
      // Create slider container
      const sliderContainer = document.createElement("div");
      sliderContainer.classList.add("slider-container");

      // Create slide track
      const slideTrack = document.createElement("div");
      slideTrack.classList.add("slide-track");

      // Create slides
      listing.media.forEach((media) => {
        const slide = document.createElement("div");
        slide.classList.add("slide");
        const mediaItem = document.createElement("img");
        mediaItem.setAttribute("src", media.url);
        mediaItem.setAttribute("alt", media.alt);
        mediaItem.classList.add("media-image");
        slide.appendChild(mediaItem);
        slideTrack.appendChild(slide);
      });

      // Append track to container
      sliderContainer.appendChild(slideTrack);

      // Create navigation buttons
      const prevButton = document.createElement("button");
      prevButton.classList.add("slider-button", "prev-button");
      prevButton.innerHTML = "&#10094;";

      const nextButton = document.createElement("button");
      nextButton.classList.add("slider-button", "next-button");
      nextButton.innerHTML = "&#10095;";

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
      mediaItem.setAttribute(
        "src",
        listing.media.length > 0 ? listing.media[0].url : "/default-image.jpg"
      );
      mediaItem.setAttribute(
        "alt",
        listing.media.length > 0 ? listing.media[0].alt : "Default Image"
      );
      mediaItem.classList.add("media-image");
      mediaGallery.appendChild(mediaItem);
    }

    cardInner.appendChild(mediaGallery);

    // Description
    const description = document.createElement("p");
    description.innerHTML = listing.description;
    cardInner.appendChild(description);

    // Bid Count
    const bidCount = document.createElement("p");
    bidCount.innerHTML = `Bids: ${listing._count.bids}`;
    cardInner.appendChild(bidCount);

    // Deadline Date
    const deadlineDate = document.createElement("p");
    deadlineDate.innerHTML = `Ends at: ${formatDeadline(listing.endsAt)}`;
    cardInner.appendChild(deadlineDate);

    const viewMoreButton = document.createElement("button");
    viewMoreButton.classList.add("btn", "btn-secondary");
    viewMoreButton.textContent = "View More";
    viewMoreButton.addEventListener("click", () => {
      if (isLoggedIn()) {
        window.location.href = `/html/singlePost.html?id=${
          listing.id
        }&title=${encodeURIComponent(listing.title)}`;
      } else {
        window.location.href =
          "/html/login.html?redirect=" +
          encodeURIComponent(
            `/html/singlePost.html?id=${listing.id}&title=${listing.title}`
          );
      }
    });
    cardInner.appendChild(viewMoreButton);
  }
}

function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
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
