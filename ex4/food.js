let cart = [];
let totalPrice = 0;

// Dish data for each shop
const shops = {
    burger: [
        { name: 'Classic Burger', price: 10 },
        { name: 'Cheeseburger', price: 12 },
        { name: 'Bacon Burger', price: 13 },
        { name: 'Veggie Burger', price: 9 },
        { name: 'Spicy Burger', price: 11 }
    ],
    pizza: [
        { name: 'Margherita Pizza', price: 15 },
        { name: 'Pepperoni Pizza', price: 16 },
        { name: 'BBQ Chicken Pizza', price: 17 },
        { name: 'Veggie Pizza', price: 14 },
        { name: 'Four Cheese Pizza', price: 18 }
    ],
    pasta: [
        { name: 'Spaghetti Bolognese', price: 12 },
        { name: 'Fettuccine Alfredo', price: 14 },
        { name: 'Penne Arrabbiata', price: 11 },
        { name: 'Lasagna', price: 15 },
        { name: 'Seafood Pasta', price: 18 }
    ],
    noodles: [
        { name: 'Chicken Noodle Soup', price: 9 },
        { name: 'Pad Thai', price: 13 },
        { name: 'Chow Mein', price: 10 },
        { name: 'Ramen', price: 12 },
        { name: 'Spicy Noodles', price: 11 }
    ]
};

function showShop(shop) {
    const shopDishes = document.getElementById('shopDishes');
    shopDishes.innerHTML = ''; // Clear previous dishes
    const dishes = shops[shop];
    document.getElementById('shopTitle').textContent = `${shop.charAt(0).toUpperCase() + shop.slice(1)} Shop`;

    dishes.forEach(dish => {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish';
        dishDiv.innerHTML = `
            <h4>${dish.name}</h4>
            <p>$${dish.price}</p>
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
