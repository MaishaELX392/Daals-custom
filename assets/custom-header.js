document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.custom-header');

  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  };

  handleScroll();

  window.addEventListener('scroll', handleScroll, { passive: true });
});