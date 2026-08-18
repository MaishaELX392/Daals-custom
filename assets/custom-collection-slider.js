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
      const item = track.querySelector(
        '.custom-collection-slider__item, [data-slider-item]'
      );

      if (!item) {
        return track.clientWidth;
      }

      const styles = window.getComputedStyle(track);
      const gap = parseFloat(
        styles.columnGap || styles.gap || '0'
      );

      return item.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
      if (!previousButton || !nextButton) {
        return;
      }

      const maxScroll = Math.max(
        0,
        track.scrollWidth - track.clientWidth
      );

      const canScroll = maxScroll > 2;

      previousButton.disabled =
        !canScroll || track.scrollLeft <= 2;

      nextButton.disabled =
        !canScroll ||
        track.scrollLeft >= maxScroll - 2;
    }

    if (previousButton) {
      previousButton.addEventListener(
        'click',
        function () {
          track.scrollBy({
            left: -getScrollAmount(),
            behavior: 'smooth'
          });
        }
      );
    }

    if (nextButton) {
      nextButton.addEventListener(
        'click',
        function () {
          track.scrollBy({
            left: getScrollAmount(),
            behavior: 'smooth'
          });
        }
      );
    }

    track.addEventListener(
      'scroll',
      updateButtons,
      {
        passive: true
      }
    );

    window.addEventListener(
      'resize',
      updateButtons
    );

    requestAnimationFrame(function () {
      updateButtons();
    });
  }

  function initAll() {
    document
      .querySelectorAll(
        '.custom-collection-slider, [data-slider-section]'
      )
      .forEach(initSlider);
  }

  window.CustomCollectionSlider = {
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
      const section = event.target.matches(
        '.custom-collection-slider, [data-slider-section]'
      )
        ? event.target
        : event.target.querySelector(
            '.custom-collection-slider, [data-slider-section]'
          );

      if (section) {
        initSlider(section);
      }
    }
  );
})();