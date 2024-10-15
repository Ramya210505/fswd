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
        { name: 'Enchiladas', price: 12, rating: 4.7 },
        { name: 'Guacamole & Chips', price: 5, rating: 4.9 },
        { name: 'Flan', price: 6, rating: 4.2 },
    ],
    asianFusion: [
        { name: 'Pad Thai', price: 10, rating: 4.5 },
        { name: 'General Tso\'s Chicken', price: 12, rating: 4.6 },
        { name: 'Dumplings', price: 8, rating: 4.4 },
        { name: 'Fried Rice', price: 9, rating: 4.3 },
        { name: 'Spring Rolls', price: 7, rating: 4.2 },
        { name: 'Mango Sticky Rice', price: 6, rating: 4.8 },
        { name: 'Wonton Soup', price: 5, rating: 4.5 },
    ],
};

// Show the restaurant menu in the modal
function showRestaurant(restaurant) {
    currentRestaurant = restaurant;
    const dishes = restaurants[restaurant];
    let dishHtml = '';
    dishes.forEach(dish => {
        dishHtml += `<div class="dish">
            <span>${dish.name} - $${dish.price.toFixed(2)}</span>
            <button onclick="addToCart('${dish.name}', ${dish.price})">Add to Cart</button>
        </div>`;
    });
    document.getElementById('restaurantTitle').innerText = restaurant.replace(/([A-Z])/g, ' $1').trim();
    document.getElementById('restaurantDishes').innerHTML = dishHtml;
    document.getElementById('modal').style.display = 'block';
}

// Close the modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Add a dish to the cart
function addToCart(dishName, dishPrice) {
    cart.push({ name: dishName, price: dishPrice });
    totalPrice += dishPrice;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice);
    updateCart();
}

// Update the cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
    });
    document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
}

// Checkout function
function checkout() {
    alert(`Thank you for your order! Your total is $${totalPrice.toFixed(2)}`);
    clearCart();
}

// Clear the cart
function clearCart() {
    cart = [];
    totalPrice = 0;
    localStorage.removeItem('cart');
    localStorage.removeItem('totalPrice');
    updateCart();
}

// Initial cart update
updateCart();
