let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
let currentRestaurant = 'italianBistro'; // Default restaurant

// Dish data for each restaurant
const restaurants = {
    italianBistro: [
        { name: 'Spaghetti Carbonara', price: 12, rating: 4.6 },
        { name: 'Margherita Pizza', price: 10, rating: 4.8 },
        { name: 'Lasagna', price: 15, rating: 4.5 },
        { name: 'Penne Arrabbiata', price: 11, rating: 4.2 },
        { name: 'Caprese Salad', price: 8, rating: 4.3 },
        { name: 'Tiramisu', price: 6, rating: 4.9 },
        { name: 'Bruschetta', price: 7, rating: 4.4 },
    ],
    sushiPlace: [
        { name: 'California Roll', price: 8, rating: 4.5 },
        { name: 'Spicy Tuna Roll', price: 10, rating: 4.7 },
        { name: 'Dragon Roll', price: 12, rating: 4.6 },
        { name: 'Tempura Roll', price: 11, rating: 4.3 },
        { name: 'Rainbow Roll', price: 14, rating: 4.8 },
        { name: 'Sashimi Platter', price: 20, rating: 4.9 },
        { name: 'Miso Soup', price: 5, rating: 4.2 },
    ],
    veganDelights: [
        { name: 'Quinoa Salad', price: 11, rating: 4.5 },
        { name: 'Vegan Tacos', price: 8, rating: 4.4 },
        { name: 'Chickpea Curry', price: 10, rating: 4.6 },
        { name: 'Vegan Burger', price: 12, rating: 4.5 },
        { name: 'Stuffed Peppers', price: 9, rating: 4.2 },
        { name: 'Coconut Chia Pudding', price: 6, rating: 4.3 },
        { name: 'Smoothie Bowl', price: 7, rating: 4.8 },
    ],
    steakhouse: [
        { name: 'Ribeye Steak', price: 25, rating: 4.8 },
        { name: 'Filet Mignon', price: 30, rating: 4.7 },
        { name: 'Grilled Salmon', price: 22, rating: 4.6 },
        { name: 'Beef Tenderloin', price: 28, rating: 4.5 },
        { name: 'Steak Frites', price: 20, rating: 4.4 },
        { name: 'Caesar Salad', price: 8, rating: 4.2 },
        { name: 'Chocolate Cake', price: 6, rating: 4.9 },
    ],
    mexicanFiesta: [
        { name: 'Tacos al Pastor', price: 9, rating: 4.6 },
        { name: 'Burrito Bowl', price: 11, rating: 4.5 },
        { name: 'Chilaquiles', price: 10, rating: 4.3 },
        { name: 'Quesadilla', price: 8, rating: 4.4 },
        { name: 'Tamales', price: 7, rating: 4.2 },
        { name: 'Guacamole with Chips', price: 5, rating: 4.8 },
        { name: 'Flan', price: 6, rating: 4.5 },
    ],
    asianFusion: [
        { name: 'Pad Thai', price: 13, rating: 4.7 },
        { name: 'Sushi Platter', price: 25, rating: 4.9 },
        { name: 'Kung Pao Chicken', price: 12, rating: 4.6 },
        { name: 'Beef Teriyaki', price: 14, rating: 4.4 },
        { name: 'Vegetable Fried Rice', price: 9, rating: 4.5 },
        { name: 'Mango Sticky Rice', price: 7, rating: 4.8 },
        { name: 'Spring Rolls', price: 5, rating: 4.3 },
    ],
};

function showRestaurant(restaurant) {
    currentRestaurant = restaurant;
    displayDishes(restaurants[restaurant]);
    document.getElementById('modal').style.display = "block";
}

function displayDishes(dishes) {
    const restaurantDishes = document.getElementById('restaurantDishes');
    restaurantDishes.innerHTML = ''; // Clear previous dishes
    document.getElementById('restaurantTitle').textContent = `${currentRestaurant.charAt(0).toUpperCase() + currentRestaurant.slice(1).replace(/([A-Z])/g, ' $1')} Menu`;

    dishes.forEach((dish, index) => {
        const dishDiv = createDishElement(dish, index);
        restaurantDishes.appendChild(dishDiv);
    });
}

function createDishElement(dish, index) {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish';
    dishDiv.innerHTML = `
        <h4>${dish.name}</h4>
        <p>Price: $${dish.price}</p>
        <p>Rating: ${'★'.repeat(Math.floor(dish.rating))}${'☆'.repeat(5 - Math.floor(dish.rating))} (${dish.rating})</p>
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
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice);
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    displayCartItems();
}

function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
    });
}

function checkout() {
    alert('Checkout not implemented yet!');
}

function clearCart() {
    cart = [];
    totalPrice = 0;
    updateCart();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const restaurantNames = document.querySelectorAll('.restaurant-name');
    restaurantNames.forEach(name => {
        name.style.color = document.body.classList.contains('dark-mode') ? 'lightgray' : '#333';
    });
}

// Initial load
displayCartItems();
