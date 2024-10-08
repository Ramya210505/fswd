let cart = [];
let totalPrice = 0;

// Dish data for each shop
const shops = {
    burger: [
        { name: 'Classic Burger', price: 10, rating: 4.5, userRating: 0 },
        { name: 'Cheeseburger', price: 12, rating: 4.0, userRating: 0 },
        { name: 'Bacon Burger', price: 13, rating: 4.8, userRating: 0 },
        { name: 'Veggie Burger', price: 9, rating: 4.2, userRating: 0 },
        { name: 'Spicy Burger', price: 11, rating: 4.7, userRating: 0 }
    ],
    pizza: [
        { name: 'Margherita Pizza', price: 15, rating: 4.6, userRating: 0 },
        { name: 'Pepperoni Pizza', price: 16, rating: 4.9, userRating: 0 },
        { name: 'BBQ Chicken Pizza', price: 17, rating: 4.4, userRating: 0 },
        { name: 'Veggie Pizza', price: 14, rating: 4.3, userRating: 0 },
        { name: 'Four Cheese Pizza', price: 18, rating: 4.1, userRating: 0 }
    ],
    pasta: [
        { name: 'Spaghetti Bolognese', price: 12, rating: 4.5, userRating: 0 },
        { name: 'Fettuccine Alfredo', price: 14, rating: 4.7, userRating: 0 },
        { name: 'Penne Arrabbiata', price: 11, rating: 4.2, userRating: 0 },
        { name: 'Lasagna', price: 15, rating: 4.6, userRating: 0 },
        { name: 'Seafood Pasta', price: 18, rating: 4.8, userRating: 0 }
    ],
    noodles: [
        { name: 'Chicken Noodle Soup', price: 9, rating: 4.3, userRating: 0 },
        { name: 'Pad Thai', price: 13, rating: 4.7, userRating: 0 },
        { name: 'Chow Mein', price: 10, rating: 4.5, userRating: 0 },
        { name: 'Ramen', price: 12, rating: 4.8, userRating: 0 },
        { name: 'Spicy Noodles', price: 11, rating: 4.4, userRating: 0 }
    ]
};

function showShop(shop) {
    const shopDishes = document.getElementById('shopDishes');
    shopDishes.innerHTML = ''; // Clear previous dishes
    const dishes = shops[shop];
    document.getElementById('shopTitle').textContent = `${shop.charAt(0).toUpperCase() + shop.slice(1)} Shop`;

    dishes.forEach((dish, index) => {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish';
        if (document.body.classList.contains('dark-mode')) {
            dishDiv.classList.add('dark-mode');
        }
        dishDiv.innerHTML = `
            <h4>${dish.name}</h4>
            <p>$${dish.price}</p>
            <p>Rating: ${'★'.repeat(Math.floor(dish.rating))}${'☆'.repeat(5 - Math.floor(dish.rating))}</p>
            <div class="rating">
                ${[1, 2, 3, 4, 5].map(i => 
                    `<span class="star" onclick="rateDish(${index}, '${shop}', ${i})">${i <= dish.userRating ? '★' : '☆'}</span>`
                ).join('')}
            </div>
            <button class="add-to-cart" onclick="addToCart('${dish.name}', ${dish.price})">Add to Cart</button>
        `;
        shopDishes.appendChild(dishDiv);
    });

    document.getElementById('modal').style.display = "block";
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
    cart = []; // Clear the cart
    totalPrice = 0;
    updateCart(); // Update UI
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const dishes = document.querySelectorAll('.dish');
    dishes.forEach(dish => {
        dish.classList.toggle('dark-mode');
    });
}

function rateDish(index, shop, rating) {
    shops[shop][index].userRating = rating; // Update the user's rating
    showShop(shop); // Refresh the dish display to show updated ratings
}
