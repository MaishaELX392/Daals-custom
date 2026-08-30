class CustomProductCard extends HTMLElement {
  connectedCallback() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.addToCartButton = this.querySelector(
      '[data-add-to-cart]'
    );

    this.buttonText = this.querySelector(
      '[data-button-text]'
    );

    this.loader = this.querySelector(
      '[data-loader]'
    );

    this.message = this.querySelector(
      '[data-message]'
    );

    this.variantId = null;

    this.setupSwatches();
    this.setupAddToCart();
  }

  setupSwatches() {
    const swatches = this.querySelectorAll(
      '[data-option-value]'
    );

    swatches.forEach((swatch) => {
      swatch.addEventListener(
        'click',
        () => {
          this.selectSwatch(swatch);
        }
      );
    });
  }

  selectSwatch(selectedSwatch) {
    const swatches = this.querySelectorAll(
      '[data-option-value]'
    );

    swatches.forEach((swatch) => {
      swatch.classList.remove('is-selected');
    });

    selectedSwatch.classList.add('is-selected');

    const value =
      selectedSwatch.dataset.optionValue;

    this.dispatchEvent(
      new CustomEvent('product-option-change', {
        bubbles: true,
        detail: {
          productId: this.dataset.productId,
          value: value
        }
      })
    );
  }

  setupAddToCart() {
    if (!this.addToCartButton) {
      return;
    }

    this.addToCartButton.addEventListener(
      'click',
      () => {
        this.addToCart();
      }
    );
  }

  async addToCart() {
    this.setLoading(true);
    this.clearMessage();

    const productId =
      this.dataset.productId;

    try {
      const response = await fetch(
        `${window.Shopify.routes.root}cart/add.js`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: [
              {
                id: productId,
                quantity: 1
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          'Unable to add product to cart'
        );
      }

      const data = await response.json();

      this.showMessage(
        'Added to cart',
        'success'
      );

      this.dispatchEvent(
        new CustomEvent('product-added-to-cart', {
          bubbles: true,
          detail: {
            item: data
          }
        })
      );

    } catch (error) {
      this.showMessage(
        'Something went wrong. Please try again.',
        'error'
      );
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(isLoading) {
    if (!this.addToCartButton) {
      return;
    }

    this.addToCartButton.classList.toggle(
      'is-loading',
      isLoading
    );

    this.addToCartButton.disabled = isLoading;

    if (this.loader) {
      this.loader.hidden = !isLoading;
    }

    if (this.buttonText) {
      this.buttonText.hidden = isLoading;
    }
  }

  showMessage(message, type) {
    if (!this.message) {
      return;
    }

    this.message.textContent = message;

    this.message.classList.remove(
      'is-success',
      'is-error'
    );

    this.message.classList.add(
      `is-${type}`
    );
  }

  clearMessage() {
    if (!this.message) {
      return;
    }

    this.message.textContent = '';

    this.message.classList.remove(
      'is-success',
      'is-error'
    );
  }
}

if (!customElements.get('custom-product-card')) {
  customElements.define(
    'custom-product-card',
    CustomProductCard
  );
}


class CustomProductGrid extends HTMLElement {
  connectedCallback() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.addEventListener(
      'product-added-to-cart',
      this.handleProductAdded.bind(this)
    );

    this.addEventListener(
      'product-option-change',
      this.handleOptionChange.bind(this)
    );
  }

  handleProductAdded(event) {
    this.dispatchEvent(
      new CustomEvent('collection-product-added', {
        bubbles: true,
        detail: event.detail
      })
    );
  }

  handleOptionChange(event) {
    const productId =
      event.detail.productId;

    const value =
      event.detail.value;

    console.log(
      'Product:',
      productId,
      'Selected:',
      value
    );
  }
}

if (!customElements.get('custom-product-grid')) {
  customElements.define(
    'custom-product-grid',
    CustomProductGrid
  );
}


document.addEventListener(
  'collection-product-added',
  () => {
    document.dispatchEvent(
      new CustomEvent('cart:refresh')
    );
  }
);