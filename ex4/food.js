let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
let currentShop = 'burger'; // Default shop

// Dish data for each themed shop
const shops = {
    burger: [
        { name: 'The Classic Burger', price: 10, rating: 4.5, userRating: 0 },
        { name: 'Cheesy Delight Burger', price: 12, rating: 4.0, userRating: 0 },
        { name: 'Bacon Explosion Burger', price: 13, rating: 4.8, userRating: 0 },
        { name: 'Garden Fresh Veggie Burger', price: 9, rating: 4.2, userRating: 0 },
        { name: 'Spicy Jalapeño Burger', price: 11, rating: 4.7, userRating: 0 }
    ],
    pizza: [
        { name: 'Margherita Masterpiece', price: 15, rating: 4.6, userRating: 0 },
        { name: 'Pepperoni Paradise', price: 16, rating: 4.9, userRating: 0 },
        { name: 'BBQ Chicken Feast', price: 17, rating: 4.4, userRating: 0 },
        { name: 'Veggie Lover’s Delight', price: 14, rating: 4.3, userRating: 0 },
        { name: 'Four Cheese Indulgence', price: 18, rating: 4.1, userRating: 0 }
    ],
    pasta: [
        { name: 'Spaghetti Bolognese Bliss', price: 12, rating: 4.5, userRating: 0 },
        { name: 'Fettuccine Alfredo Delight', price: 14, rating: 4.7, userRating: 0 },
        { name: 'Penne Arrabbiata Adventure', price: 11, rating: 4.2, userRating: 0 },
        { name: 'Lasagna Layers of Love', price: 15, rating: 4.6, userRating: 0 },
        { name: 'Seafood Pasta Sensation', price: 18, rating: 4.8, userRating: 0 }
    ],
    noodles: [
        { name: 'Hearty Chicken Noodle Soup', price: 9, rating: 4.3, userRating: 0 },
        { name: 'Pad Thai Paradise', price: 13, rating: 4.7, userRating: 0 },
        { name: 'Chow Mein Charm', price: 10, rating: 4.5, userRating: 0 },
        { name: 'Authentic Ramen Retreat', price: 12, rating: 4.8, userRating: 0 },
        { name: 'Spicy Noodle Challenge', price: 11, rating: 4.4, userRating: 0 }
    ]
};

function showShop(shop) {
    currentShop = shop;
    displayDishes(shops[shop]);
    document.getElementById('modal').style.display = "block";
}

function displayDishes(dishes) {
    const shopDishes = document.getElementById('shopDishes');
    shopDishes.innerHTML = ''; // Clear previous dishes
    document.getElementById('shopTitle').textContent = `${currentShop.charAt(0).toUpperCase() + currentShop.slice(1)} Restaurant Menu`;

    dishes.forEach((dish, index) => {
        const dishDiv = createDishElement(dish, index);
        shopDishes.appendChild(dishDiv);
    });
}

function createDishElement(dish, index) {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish';
    dishDiv.innerHTML = `
        <h4>${dish.name}</h4>
        <p>Price: $${dish.price}</p>
        <p>Rating: ${'★'.repeat(Math.floor(dish.rating))}${'☆'.repeat(5 - Math.floor(dish.rating))}</p>
        <div class="rating">
            ${[1, 2, 3, 4, 5].map(i => 
                `<span class="star" onclick="rateDish(${index}, '${currentShop}', ${i})">${i <= dish.userRating ? '★' : '☆'}</span>`
            ).join('')}
        </div>
        <button class="add-to-cart" onclick="addToCart('${dish.name}', ${dish.price})">Add to Cart</button>
    `;
    return dishDiv;
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}

function addToCart(itemName, itemPrice) {
    cart.push({ name: itemName, price: itemPrice });
    totalPrice += itemPrice;
    updateCart();
    saveCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = ''; // Clear current items

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(li);
    });

    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert(`Thank you for your order! Total: $${totalPrice.toFixed(2)}`);
    clearCart();
}

function clearCart() {
    cart = [];
    totalPrice = 0;
    updateCart();
    localStorage.removeItem('cart');
    localStorage.removeItem('totalPrice');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice);
}

// Load cart on page load
window.onload = function() {
    updateCart();
};

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function rateDish(index, shop, rating) {
    shops[shop][index].userRating = rating; // Update the user's rating
    showShop(shop); // Refresh the dish display to show updated ratings
}
