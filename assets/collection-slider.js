(function () {
  function initSlider(section) {
    if (!section || section.dataset.sliderInitialized === 'true') {
      return;
    }

    const track = section.querySelector('[data-slider-track]');
    const previousButton = section.querySelector('[data-slider-prev]');
    const nextButton = section.querySelector('[data-slider-next]');

    if (!track) {
      return;
    }

    section.dataset.sliderInitialized = 'true';

    function getScrollAmount() {
      const item = track.querySelector('.collection-slider__item');

      if (!item) {
        return track.clientWidth;
      }

      const gap = parseFloat(
        window.getComputedStyle(track).columnGap ||
          window.getComputedStyle(track).gap ||
          '0'
      );

      return item.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
      if (!previousButton || !nextButton) {
        return;
      }

      const maxScroll =
        track.scrollWidth - track.clientWidth;

      previousButton.disabled =
        track.scrollLeft <= 2;

      nextButton.disabled =
        track.scrollLeft >= maxScroll - 2;
    }

    if (previousButton) {
      previousButton.addEventListener('click', function () {
        track.scrollBy({
          left: -getScrollAmount(),
          behavior: 'smooth'
        });
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        track.scrollBy({
          left: getScrollAmount(),
          behavior: 'smooth'
        });
      });
    }

    track.addEventListener(
      'scroll',
      updateButtons,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      updateButtons
    );

    updateButtons();
  }

  function initAll() {
    document
      .querySelectorAll('.collection-slider')
      .forEach(initSlider);
  }

  window.CollectionSlider = {
    init: initSlider,
    initAll: initAll
  };

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initAll
    );
  } else {
    initAll();
  }

  document.addEventListener(
    'shopify:section:load',
    function (event) {
      const section = event.target.querySelector(
        '.collection-slider'
      );

      if (section) {
        initSlider(section);
      }
    }
  );
})();