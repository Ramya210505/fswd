let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
let currentRestaurant = 'italianBistro';

const restaurants = {
    italianBistro: [
        { name: 'Spaghetti Carbonara', price: 12, rating: 0 },
        { name: 'Margherita Pizza', price: 10, rating: 0 },
        { name: 'Lasagna', price: 15, rating: 0 },
        { name: 'Penne Arrabbiata', price: 11, rating: 0 },
        { name: 'Caprese Salad', price: 8, rating: 0 },
        { name: 'Tiramisu', price: 6, rating: 0 },
        { name: 'Bruschetta', price: 7, rating: 0 },
    ],
    sushiPlace: [
        { name: 'California Roll', price: 8, rating: 0 },
        { name: 'Spicy Tuna Roll', price: 10, rating: 0 },
        { name: 'Dragon Roll', price: 12, rating: 0 },
        { name: 'Tempura Roll', price: 11, rating: 0 },
        { name: 'Rainbow Roll', price: 14, rating: 0 },
        { name: 'Sashimi Platter', price: 20, rating: 0 },
        { name: 'Miso Soup', price: 5, rating: 0 },
    ],
    veganDelights: [
        { name: 'Quinoa Salad', price: 11, rating: 0 },
        { name: 'Vegan Tacos', price: 8, rating: 0 },
        { name: 'Chickpea Curry', price: 10, rating: 0 },
        { name: 'Vegan Burger', price: 12, rating: 0 },
        { name: 'Stuffed Peppers', price: 9, rating: 0 },
        { name: 'Coconut Chia Pudding', price: 6, rating: 0 },
        { name: 'Smoothie Bowl', price: 7, rating: 0 },
    ],
    steakhouse: [
        { name: 'Ribeye Steak', price: 25, rating: 0 },
        { name: 'Filet Mignon', price: 30, rating: 0 },
        { name: 'Grilled Salmon', price: 22, rating: 0 },
        { name: 'Beef Tenderloin', price: 28, rating: 0 },
        { name: 'Steak Frites', price: 20, rating: 0 },
        { name: 'Caesar Salad', price: 8, rating: 0 },
        { name: 'Chocolate Cake', price: 7, rating: 0 },
    ],
    mexicanFiesta: [
        { name: 'Tacos', price: 10, rating: 0 },
        { name: 'Burrito', price: 12, rating: 0 },
        { name: 'Enchiladas', price: 11, rating: 0 },
        { name: 'Chili Con Carne', price: 13, rating: 0 },
        { name: 'Guacamole & Chips', price: 7, rating: 0 },
        { name: 'Flan', price: 5, rating: 0 },
        { name: 'Margarita', price: 8, rating: 0 },
    ],
    asianFusion: [
        { name: 'Pad Thai', price: 12, rating: 0 },
        { name: 'Kung Pao Chicken', price: 14, rating: 0 },
        { name: 'Curry Rice', price: 11, rating: 0 },
        { name: 'Spring Rolls', price: 6, rating: 0 },
        { name: 'Fried Rice', price: 10, rating: 0 },
        { name: 'Mango Sticky Rice', price: 8, rating: 0 },
        { name: 'Bubble Tea', price: 4, rating: 0 },
    ]
};

// Show restaurant menu in modal
function showRestaurant(restaurant) {
    currentRestaurant = restaurant;
    const dishes = restaurants[restaurant];
    const title = document.getElementById('restaurantTitle');
    const dishContainer = document.getElementById('restaurantDishes');

    title.textContent = restaurant.charAt(0).toUpperCase() + restaurant.slice(1).replace(/([A-Z])/g, ' $1');
    dishContainer.innerHTML = '';

    dishes.forEach((dish, index) => {
        const dishElement = document.createElement('div');
        dishElement.className = 'dish';
        dishElement.innerHTML = `
            <p>${dish.name} - $${dish.price.toFixed(2)}</p>
            <div class="rating" data-index="${index}">
                ${createStars(dish.rating)}
            </div>
            <button onclick="addToCart('${dish.name}', ${dish.price})">Add to Cart</button>
        `;
        dishContainer.appendChild(dishElement);
    });

    document.getElementById('modal').style.display = 'block';
}

// Create star rating elements
function createStars(currentRating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star" onclick="rateDish(this, ${i})">${i <= currentRating ? '★' : '☆'}</span>`;
    }
    return stars;
}

// Rate a dish
function rateDish(star, newRating) {
    const index = star.parentElement.getAttribute('data-index');
    const stars = star.parentElement.children;

    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove('rated');
        if (i < newRating) {
            stars[i].classList.add('rated');
        }
    }

    restaurants[currentRestaurant][index].rating = newRating; // Update rating
}

// Close modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Add to cart
function addToCart(dishName, price) {
    cart.push(dishName);
    totalPrice += price;
    updateCart();
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-item';
        removeButton.onclick = () => removeFromCart(index);
        li.appendChild(removeButton);
        cartItems.appendChild(li);
    });

    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice);
}

// Remove item from cart
function removeFromCart(index) {
    const itemPrice = restaurants[currentRestaurant].find(dish => dish.name === cart[index]).price;
    cart.splice(index, 1); // Remove item from cart
    totalPrice -= itemPrice; // Update total price
    updateCart();
}

// Checkout
function checkout() {
    alert(`Checkout successful! Total amount: $${totalPrice.toFixed(2)}`);
    clearCart();
}

// Clear cart
function clearCart() {
    cart = [];
    totalPrice = 0;
    updateCart();
}
