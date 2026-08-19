document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.custom-header');

  if (!header) {
    return;
  }

  function handleScroll() {
    if (window.scrollY > 10) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  }

  handleScroll();

  window.addEventListener('scroll', handleScroll);
});