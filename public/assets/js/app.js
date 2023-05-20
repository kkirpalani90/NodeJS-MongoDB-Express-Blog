document.addEventListener("DOMContentLoaded", function () {
  const searchButtons = document.querySelectorAll(".search-btn");
  const searchBar = document.querySelector(".search-bar");
  const searchInput = document.getElementById("searchInput");
  const closeSearch = document.getElementById("close-search");
  const body = document.body;
  window.addEventListener("load", (event) => {
    searchBar.classList.remove("displayNone");
  });

  for (var i = 0; i < searchButtons.length; i++) {
    searchButtons[i].addEventListener("click", function () {
      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      searchInput.focus();
      body.classList.add("fixed");
    });
  }

  closeSearch.addEventListener("click", function () {
    searchBar.style.visibility = "hidden";
    body.classList.remove("fixed");
    searchBar.classList.remove("open");
    this.setAttribute("aria-expanded", "false");
  });
});

// JavaScript
const searchBar = document.querySelector(".search-bar");

searchBar.addEventListener("click", function () {
  if (this.classList.contains("open")) {
    document.body.classList.add("fixed");
  } else {
    document.body.classList.remove("fixed");
  }
});
