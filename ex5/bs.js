
const categories = ['Cars', 'Mobiles', 'Bikes', 'Electronics Accessories', 'Furniture'];
const products = {
    Cars: [
        { id: 1, title: "Honda Civic", description: "Compact car.", price: 20000, location: "Los Angeles", rating: 4.5 },
        { id: 2, title: "Ford Mustang", description: "Sports car.", price: 30000, location: "Miami", rating: 4.7 },
        { id: 3, title: "Toyota Corolla", description: "Reliable sedan.", price: 18000, location: "Chicago", rating: 4.3 },
        { id: 4, title: "Chevrolet Malibu", description: "Comfortable family car.", price: 22000, location: "Houston", rating: 4.4 },
        { id: 5, title: "Nissan Altima", description: "Stylish sedan.", price: 24000, location: "Phoenix", rating: 4.6 },
    ],
    Mobiles: [
        { id: 6, title: "Samsung Galaxy S21", description: "Latest smartphone from Samsung.", price: 799, location: "New York", rating: 4.8 },
        { id: 7, title: "Apple iPhone 12", description: "Latest iPhone model.", price: 999, location: "San Francisco", rating: 4.9 },
        { id: 8, title: "OnePlus 9", description: "High-performance phone.", price: 729, location: "Seattle", rating: 4.6 },
        { id: 9, title: "Google Pixel 5", description: "Great camera phone.", price: 699, location: "Denver", rating: 4.5 },
        { id: 10, title: "Xiaomi Mi 11", description: "Feature-rich smartphone.", price: 749, location: "Atlanta", rating: 4.4 },
    ],
    Bikes: [
        { id: 11, title: "Yamaha YZF-R3", description: "Sport bike.", price: 5500, location: "Orlando", rating: 4.3 },
        { id: 12, title: "Kawasaki Ninja 400", description: "Lightweight and powerful.", price: 6000, location: "Austin", rating: 4.5 },
        { id: 13, title: "Honda CB500F", description: "Versatile commuter bike.", price: 6500, location: "Philadelphia", rating: 4.2 },
        { id: 14, title: "Suzuki SV650", description: "V-twin engine, great for beginners.", price: 7000, location: "Boston", rating: 4.4 },
        { id: 15, title: "Ducati Monster 821", description: "Iconic naked bike.", price: 10000, location: "San Diego", rating: 4.7 },
    ],
    "Electronics Accessories": [
        { id: 16, title: "Wireless Headphones", description: "Noise-cancelling feature.", price: 199, location: "Miami", rating: 4.5 },
        { id: 17, title: "Bluetooth Speaker", description: "Portable and waterproof.", price: 99, location: "Houston", rating: 4.2 },
        { id: 18, title: "USB-C Charging Cable", description: "Fast charging.", price: 19, location: "Dallas", rating: 4.0 },
        { id: 19, title: "Laptop Stand", description: "Adjustable height.", price: 49, location: "Austin", rating: 4.3 },
        { id: 20, title: "Portable SSD", description: "1TB storage capacity.", price: 129, location: "Seattle", rating: 4.6 },
    ],
    Furniture: [
        { id: 21, title: "Sofa Set", description: "Comfortable 3-seater.", price: 499, location: "New York", rating: 4.7 },
        { id: 22, title: "Dining Table", description: "Seats 6 people.", price: 299, location: "Los Angeles", rating: 4.6 },
        { id: 23, title: "Queen Bed Frame", description: "Stylish and sturdy.", price: 399, location: "Chicago", rating: 4.5 },
        { id: 24, title: "Office Chair", description: "Ergonomic design.", price: 149, location: "Houston", rating: 4.4 },
        { id: 25, title: "Bookshelf", description: "5-tier adjustable shelf.", price: 199, location: "Atlanta", rating: 4.3 },
    ],
};

let loggedIn = false;
let cart = [];
let recentPurchases = [];

function render(page) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    if (page === 'login') {
        loginPage();
    } else if (page === 'home') {
        homePage();
    } else if (page.startsWith('category_')) {
        const category = page.split('_')[1];
        categoryPage(category);
    } else if (page === 'add-product') {
        addProductPage();
    } else if (page === 'cart') {
        displayCart();
    } else if (page === 'recent') {
        displayRecentPurchases();
    }
}

function loginPage() {
    const container = document.createElement('div');
    container.classList.add('container');

    const form = document.createElement('form');
    form.onsubmit = (e) => {
        e.preventDefault();
        loggedIn = true;
        alert('Logged in successfully!');
        render('home');
    };

    form.innerHTML = `
        <h2>Login</h2>
        <input type="text" placeholder="Username" required>
        <input type="password" placeholder="Password" required>
        <button type="submit" class="button">Login</button>
    `;
    
    container.appendChild(form);
    document.getElementById('app').appendChild(container);
}

function homePage() {
    const container = document.createElement('div');
    container.classList.add('container');

    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category');

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<h3 style="text-align:center;">${category}</h3>`;
        categoryDiv.onclick = () => render(`category_${category}`);
        categoryContainer.appendChild(categoryDiv);
    });

    container.appendChild(categoryContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.marginTop = '20px';

    const addProductButton = createButton('Add Product', () => {
        if (loggedIn) {
            render('add-product');
        } else {
            alert('Please log in to add products.');
        }
    }, 'button', '#e0f7fa');

    const cartButton = createButton('View Cart', () => render('cart'), 'button', '#ffebee');
    const recentButton = createButton('View Recent Purchases', () => render('recent'), 'button', '#f3e5f5');

    buttonContainer.appendChild(addProductButton);
    buttonContainer.appendChild(cartButton);
    buttonContainer.appendChild(recentButton);
    container.appendChild(buttonContainer);

    document.getElementById('app').appendChild(container);
}

function categoryPage(category) {
    const container = document.createElement('div');
    container.classList.add('container');

    const heading = document.createElement('h2');
    heading.textContent = category;
    heading.style.textAlign = 'center';
    container.appendChild(heading);

    products[category].forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.backgroundColor = getCategoryColor(category);
        productCard.style.color = 'black';
        productCard.innerHTML = `
            <h2>${product.title} <span style="font-size: 0.8em; color: #f39c12;">★ ${product.rating}</span></h2>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Location: ${product.location}</p>
        `;

        const addToCartButton = createHeartButton(() => addToCart(product), product.id);
        productCard.appendChild(addToCartButton);

        const buyButton = document.createElement('button');
        buyButton.className = 'button buy-button';
        buyButton.textContent = 'Buy Now';
        buyButton.onclick = () => {
            recentPurchases.push(product);
            alert(`You bought ${product.title}!`);
        };

        productCard.appendChild(buyButton);
        container.appendChild(productCard);
    });

    const backButton = createButton('Back to Categories', () => render('home'));
    container.appendChild(backButton);

    document.getElementById('app').appendChild(container);
}

function addToCart(product) {
    if (!cart.includes(product)) {
        cart.push(product);
        alert(`${product.title} added to cart!`);
    } else {
        alert(`${product.title} is already in the cart.`);
    }
}

function displayCart() {
    const container = document.createElement('div');
    container.classList.add('container');

    const heading = document.createElement('h2');
    heading.textContent = 'Shopping Cart';
    container.appendChild(heading);

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <h3>${item.title} <span style="font-size: 0.8em; color: #f39c12;">★ ${item.rating}</span></h3>
            <p>Price: $${item.price}</p>
            <p>Location: ${item.location}</p>
        `;
        container.appendChild(itemDiv);
    });

    const backButton = createButton('Back to Home', () => render('home'));
    container.appendChild(backButton);

    document.getElementById('app').appendChild(container);
}

function displayRecentPurchases() {
    const container = document.createElement('div');
    container.classList.add('container');

    const heading = document.createElement('h2');
    heading.textContent = 'Recent Purchases';
    container.appendChild(heading);

    recentPurchases.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <h3>${item.title} <span style="font-size: 0.8em; color: #f39c12;">★ ${item.rating}</span></h3>
            <p>Price: $${item.price}</p>
            <p>Location: ${item.location}</p>
        `;
        container.appendChild(itemDiv);
    });

    const backButton = createButton('Back to Home', () => render('home'));
    container.appendChild(backButton);

    document.getElementById('app').appendChild(container);
}

function createHeartButton(callback, id) {
    const button = document.createElement('button');
    button.className = 'heart-button';
    button.innerHTML = `<span class="heart" id="heart-${id}">❤️</span>`;
    button.onclick = callback;
    return button;
}

function createButton(text, callback, type = 'button', bgColor = '#ffffff') {
    const button = document.createElement('button');
    button.className = 'button';
    button.textContent = text;
    button.onclick = callback;
    button.style.backgroundColor = bgColor;
    button.style.margin = '10px';
    button.style.fontWeight = 'bold';
    return button;
}

function getCategoryColor(category) {
    switch (category) {
        case 'Cars': return '#ffe0b2'; // Light orange
        case 'Mobiles': return '#e3f2fd'; // Light blue
        case 'Bikes': return '#f1f8e9'; // Light green
        case 'Electronics Accessories': return '#ffecb3'; // Light yellow
        case 'Furniture': return '#f8bbd0'; // Light pink
        default: return '#ffffff'; // White
    }
}

function addProductPage() {
    const container = document.createElement('div');
    container.classList.add('container');

    const form = document.createElement('form');
    form.onsubmit = (e) => {
        e.preventDefault();
        alert('Product added successfully!');
        render('home');
    };

    const closeButton = createButton('Close', () => render('home'), 'button', '#ffcccb');
    container.appendChild(closeButton);

    form.innerHTML = `
        <h2>Add Product</h2>
        <input type="text" placeholder="Product Title" required>
        <input type="text" placeholder="Description" required>
        <input type="number" placeholder="Price" required>
        <input type="text" placeholder="Location" required>
        <select required>
            <option value="" disabled selected>Select Category</option>
            ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
        </select>
        <button type="submit" class="button">Add Product</button>
    `;
    
    container.appendChild(form);
    document.getElementById('app').appendChild(container);
}

// Initial render
render('login');
