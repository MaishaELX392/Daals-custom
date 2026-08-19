document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".custom-header");

  if (!header) {
    return;
  }

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 10) {
      header.classList.add("is-sticky");
    } else {
      header.classList.remove("is-sticky");
    }
  });
});