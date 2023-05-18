document.addEventListener("DOMContentLoaded", function () {
  const searchButtons = document.querySelectorAll(".search-btn");
  const searchBar = document.querySelector(".search-bar");
  const searchInput = document.getElementById("searchInput");
  const closeSearch = document.getElementById("close-search");

  for (var i = 0; i < searchButtons.length; i++) {
    searchButtons[i].addEventListener("click", function () {
      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      searchInput.focus();
    });
  }

  closeSearch.addEventListener("click", function () {
    searchBar.style.visibility = "hidden";
    searchBar.classList.remove("open");
    this.setAttribute("aria-expanded", "false");
  });
});
