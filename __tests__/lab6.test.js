describe('User Flow for Website', () => {
  beforeAll(async () => {
    await page.goto('https://elaine-ch.github.io/Lab6_Part1_Starter/');
  });

  it('Check if 20 product items are loaded', async () => {
    console.log('Checking for 20 product items...');
    const numberOfItems = await page.$$eval('product-item', items => items.length);
    expect(numberOfItems).toBe(20);
  });

  it('Ensure all product items are populated', async () => {
    console.log('Checking if product items are populated...');
    let allItemsPopulated = true;
    const itemsData = await page.$$eval('product-item', items => {
      return items.map(item => item.data);
    });
    itemsData.forEach(item => {
      if (!item.title || !item.price || !item.image) {
        allItemsPopulated = false;
      }
    });
    expect(allItemsPopulated).toBe(true);
  }, 10000);

  it('Check if "Add to Cart" button toggles text', async () => {
    console.log('Checking the "Add to Cart" button...');
    const firstProductItem = await page.$('product-item');
    const shadowRoot = await firstProductItem.getProperty('shadowRoot');
    const addButton = await shadowRoot.$('button');
    await addButton.click();
    const buttonText = await addButton.evaluate(button => button.innerText);
    expect(buttonText).toBe('Remove from Cart');
    await addButton.click(); 
  }, 2500);

  it('Check if cart count updates correctly', async () => {
    console.log('Checking cart count...');
    const productItems = await page.$$('product-item');
    for (const productItem of productItems) {
      const shadowRoot = await productItem.getProperty('shadowRoot');
      const addButton = await shadowRoot.$('button');
      await addButton.click();
    }
    const cartCountElement = await page.$('#cart-count');
    const cartCountValue = await cartCountElement.evaluate(cartCount => cartCount.innerText);
    expect(cartCountValue).toBe('20');
  }, 30000);

  it('Check if cart items persist after reload', async () => {
    console.log('Checking cart items after reload...');
    await page.reload();
    const productItems = await page.$$('product-item');
    let allButtonsCorrect = true;
    for (const productItem of productItems) {
      const shadowRoot = await productItem.getProperty('shadowRoot');
      const addButton = await shadowRoot.$('button');
      const buttonText = await addButton.evaluate(button => button.innerText);
      if (buttonText !== 'Remove from Cart') {
        allButtonsCorrect = false;
      }
    }
    expect(allButtonsCorrect).toBe(true);
    const cartCountElement = await page.$('#cart-count');
    const cartCountValue = await cartCountElement.evaluate(cartCount => cartCount.innerText);
    expect(cartCountValue).toBe('20');
  }, 10000);

  it('Check if cart in localStorage is correct', async () => {
    console.log('Checking localStorage cart...');
    const expectedCart = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('cart')));
    expect(cart).toEqual(expectedCart);
  }, 10000);

  it('Check if cart count updates correctly after removing items', async () => {
    console.log('Checking cart count after removing items...');
    const productItems = await page.$$('product-item');
    for (const productItem of productItems) {
      const shadowRoot = await productItem.getProperty('shadowRoot');
      const removeButton = await shadowRoot.$('button');
      await removeButton.click();
    }
    const cartCountElement = await page.$('#cart-count');
    const cartCountValue = await cartCountElement.evaluate(cartCount => cartCount.innerText);
    expect(cartCountValue).toBe('0');
  }, 30000);

  it('Check if cart items persist after reload with empty cart', async () => {
    console.log('Checking cart items after reload with empty cart...');
    await page.reload();
    const productItems = await page.$$('product-item');
    let allButtonsCorrect = true;
    for (const productItem of productItems) {
      const shadowRoot = await productItem.getProperty('shadowRoot');
      const addButton = await shadowRoot.$('button');
      const buttonText = await addButton.evaluate(button => button.innerText);
      if (buttonText !== 'Add to Cart') {
        allButtonsCorrect = false;
      }
    }
    expect(allButtonsCorrect).toBe(true);
    const cartCountElement = await page.$('#cart-count');
    const cartCountValue = await cartCountElement.evaluate(cartCount => cartCount.innerText);
    expect(cartCountValue).toBe('0');
  }, 10000);

  it('Check if localStorage for cart is empty after removing all items', async () => {
    console.log('Checking localStorage for empty cart...');
    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('cart')));
    expect(cart).toEqual([]);
  });
});
