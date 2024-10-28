const categories = ['Cars', 'Mobiles', 'Bikes', 'Electronics Accessories', 'Furniture'];
const products = {
    Cars: [
        { id: 1, title: "Honda Civic", description: "Compact car.", price: 20000, location: "Los Angeles" },
        { id: 2, title: "Ford Mustang", description: "Sports car.", price: 30000, location: "Miami" },
        { id: 3, title: "Toyota Corolla", description: "Reliable sedan.", price: 18000, location: "Chicago" },
        { id: 4, title: "Chevrolet Malibu", description: "Comfortable family car.", price: 22000, location: "Houston" },
        { id: 5, title: "Nissan Altima", description: "Stylish sedan.", price: 24000, location: "Phoenix" },
    ],
    Mobiles: [
        { id: 6, title: "Samsung Galaxy S21", description: "Latest smartphone from Samsung.", price: 799, location: "New York" },
        { id: 7, title: "Apple iPhone 12", description: "Latest iPhone model.", price: 999, location: "San Francisco" },
        { id: 8, title: "OnePlus 9", description: "High-performance phone.", price: 729, location: "Seattle" },
        { id: 9, title: "Google Pixel 5", description: "Great camera phone.", price: 699, location: "Denver" },
        { id: 10, title: "Xiaomi Mi 11", description: "Feature-rich smartphone.", price: 749, location: "Atlanta" },
    ],
    Bikes: [
        { id: 11, title: "Yamaha YZF-R3", description: "Sport bike.", price: 5500, location: "Orlando" },
        { id: 12, title: "Kawasaki Ninja 400", description: "Lightweight and powerful.", price: 6000, location: "Austin" },
        { id: 13, title: "Honda CB500F", description: "Versatile commuter bike.", price: 6500, location: "Philadelphia" },
        { id: 14, title: "Suzuki SV650", description: "V-twin engine, great for beginners.", price: 7000, location: "Boston" },
        { id: 15, title: "Ducati Monster 821", description: "Iconic naked bike.", price: 10000, location: "San Diego" },
    ],
    "Electronics Accessories": [
        { id: 16, title: "Wireless Headphones", description: "Noise-cancelling feature.", price: 199, location: "Miami" },
        { id: 17, title: "Bluetooth Speaker", description: "Portable and waterproof.", price: 99, location: "Houston" },
        { id: 18, title: "USB-C Charging Cable", description: "Fast charging.", price: 19, location: "Dallas" },
        { id: 19, title: "Laptop Stand", description: "Adjustable height.", price: 49, location: "Austin" },
        { id: 20, title: "Portable SSD", description: "1TB storage capacity.", price: 129, location: "Seattle" },
    ],
    Furniture: [
        { id: 21, title: "Sofa Set", description: "Comfortable 3-seater.", price: 499, location: "New York" },
        { id: 22, title: "Dining Table", description: "Seats 6 people.", price: 299, location: "Los Angeles" },
        { id: 23, title: "Queen Bed Frame", description: "Stylish and sturdy.", price: 399, location: "Chicago" },
        { id: 24, title: "Office Chair", description: "Ergonomic design.", price: 149, location: "Houston" },
        { id: 25, title: "Bookshelf", description: "5-tier adjustable shelf.", price: 199, location: "Atlanta" },
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
        <button type="submit" class="button" style="padding: 15px 30px; font-weight: bold;">Login</button>
    `;
    
    container.appendChild(form);
    document.getElementById('app').appendChild(container);
}

function homePage() {
    const container = document.createElement('div');
    container.classList.add('container');

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-around';
    buttonContainer.style.marginBottom = '20px';

    const addProductButton = createButton('Add Product', () => {
        if (loggedIn) {
            render('add-product');
        } else {
            alert('Please log in to add products.');
        }
    }, 'button', 'orange');

    const cartButton = createButton('View Cart', () => render('cart'), 'button', 'blue');
    const recentButton = createButton('View Recent Purchases', () => render('recent'), 'button', 'purple');

    buttonContainer.appendChild(addProductButton);
    buttonContainer.appendChild(cartButton);
    buttonContainer.appendChild(recentButton);
    container.appendChild(buttonContainer);

    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category');

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<h3 style="text-align:center;">${category}</h3>`;
        categoryDiv.onclick = () => render(`category_${category}`);
        categoryContainer.appendChild(categoryDiv);
    });

    container.appendChild(categoryContainer);
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
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Location: ${product.location}</p>
        `;

        const addToCartIcon = document.createElement('button');
        addToCartIcon.className = 'button add-to-cart-icon';
        addToCartIcon.innerHTML = '<svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>';
        addToCartIcon.onclick = () => {
            cart.push(product);
            alert(`${product.title} added to cart!`);
        };
        productCard.appendChild(addToCartIcon);

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

function displayCart() {
    const container = document.createElement('div');
    container.classList.add('container');

    const heading = document.createElement('h2');
    heading.textContent = 'Shopping Cart';
    container.appendChild(heading);

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <h3>${item.title}</h3>
            <p>Price: $${item.price}</p>
        `;
        container.appendChild(itemDiv);
    });

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<strong>Total Price: $${totalPrice}</strong>`;
    container.appendChild(totalDiv);

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
            <h3>${item.title}</h3>
            <p>Price: $${item.price}</p>
        `;
        container.appendChild(itemDiv);
    });

    const backButton = createButton('Back to Home', () => render('home'));
    container.appendChild(backButton);

    document.getElementById('app').appendChild(container);
}

function addProductPage() {
    const container = document.createElement('div');
    container.classList.add('container');

    const form = document.createElement('form');
    form.onsubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle adding the product logic.
        alert('Product added successfully!');
        render('home');
    };

    form.innerHTML = `
        <h2>Add Product</h2>
        <input type="text" placeholder="Product Title" required>
        <input type="text" placeholder="Description" required>
        <input type="number" placeholder="Price" required>
        <input type="text" placeholder="Location" required>
        <button type="submit" class="button">Add Product</button>
    `;
    
    container.appendChild(form);
    document.getElementById('app').appendChild(container);
}

function createButton(text, onClick, className = 'button', color = 'blue') {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.className = className;
    button.style.backgroundColor = color;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    return button;
}

function getCategoryColor(category) {
    const colors = {
        Cars: '#E3F2FD', // Light Blue
        Mobiles: '#FFF3E0', // Light Orange
        Bikes: '#F1F8E9', // Light Green
        "Electronics Accessories": '#E8F5E9', // Light Mint
        Furniture: '#FCE4EC' // Light Pink
    };
    return colors[category] || '#FFFFFF'; // Default to white if category not found
}

// Initial render
render('login');
