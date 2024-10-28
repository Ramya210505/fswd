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
        { id: 1, title: "Samsung Galaxy S21", description: "Latest smartphone from Samsung.", price: 799, location: "New York" },
        { id: 2, title: "Apple iPhone 12", description: "Latest iPhone model.", price: 999, location: "San Francisco" },
        { id: 3, title: "OnePlus 9", description: "High-performance phone.", price: 729, location: "Seattle" },
        { id: 4, title: "Google Pixel 5", description: "Great camera phone.", price: 699, location: "Denver" },
        { id: 5, title: "Xiaomi Mi 11", description: "Feature-rich smartphone.", price: 749, location: "Atlanta" },
    ],
    Bikes: [
        { id: 1, title: "Yamaha YZF-R3", description: "Sport bike.", price: 5500, location: "Orlando" },
        { id: 2, title: "Kawasaki Ninja 400", description: "Lightweight and powerful.", price: 6000, location: "Austin" },
        { id: 3, title: "Honda CB500F", description: "Versatile commuter bike.", price: 6500, location: "Philadelphia" },
        { id: 4, title: "Suzuki SV650", description: "V-twin engine, great for beginners.", price: 7000, location: "Boston" },
        { id: 5, title: "Ducati Monster 821", description: "Iconic naked bike.", price: 10000, location: "San Diego" },
    ],
    "Electronics Accessories": [
        { id: 1, title: "Wireless Headphones", description: "Noise-cancelling feature.", price: 199, location: "Miami" },
        { id: 2, title: "Bluetooth Speaker", description: "Portable and waterproof.", price: 99, location: "Houston" },
        { id: 3, title: "USB-C Charging Cable", description: "Fast charging.", price: 19, location: "Dallas" },
        { id: 4, title: "Laptop Stand", description: "Adjustable height.", price: 49, location: "Austin" },
        { id: 5, title: "Portable SSD", description: "1TB storage capacity.", price: 129, location: "Seattle" },
    ],
    Furniture: [
        { id: 1, title: "Sofa Set", description: "Comfortable 3-seater.", price: 499, location: "New York" },
        { id: 2, title: "Dining Table", description: "Seats 6 people.", price: 299, location: "Los Angeles" },
        { id: 3, title: "Queen Bed Frame", description: "Stylish and sturdy.", price: 399, location: "Chicago" },
        { id: 4, title: "Office Chair", description: "Ergonomic design.", price: 149, location: "Houston" },
        { id: 5, title: "Bookshelf", description: "5-tier adjustable shelf.", price: 199, location: "Atlanta" },
    ],
};

let loggedIn = false;

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
        <button type="submit">Login</button>
    `;

    container.appendChild(form);
    app.appendChild(container);
}

function homePage() {
    const container = document.createElement('div');
    container.classList.add('container');

    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category');

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<h3>${category}</h3>`;
        categoryDiv.onclick = () => render(`category_${category}`);
        categoryContainer.appendChild(categoryDiv);
    });

    container.appendChild(categoryContainer);
    
    // Add Product button
    const addProductButton = document.createElement('button');
    addProductButton.className = 'button';
    addProductButton.innerText = 'Add Product';
    addProductButton.onclick = () => {
        if (loggedIn) {
            render('add-product');
        } else {
            alert('Please log in to add products.');
        }
    };
    container.appendChild(addProductButton);

    app.appendChild(container);
}

function categoryPage(category) {
    const container = document.createElement('div');
    container.classList.add('container');

    const productList = products[category] || [];
    
    productList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h2>${product.title}</h2>
            <p>Description: ${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Location: ${product.location}</p>
            <svg class="cart-icon" onclick="addToCart(${product.id})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="red"/>
            </svg>
        `;
        container.appendChild(card);
    });

    // Back Button
    const backButton = document.createElement('button');
    backButton.className = 'button';
    backButton.innerText = 'Back to Home';
    backButton.onclick = () => render('home');
    container.appendChild(backButton);

    app.appendChild(container);
}

function addToCart(productId) {
    alert(`Product ID ${productId} added to cart!`);
    // Here you can implement further cart functionality
}

function addProductPage() {
    const container = document.createElement('div');
    container.classList.add('container');

    const form = document.createElement('form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const title = form.elements[0].value;
        const description = form.elements[1].value;
        const price = form.elements[2].value;
        const location = form.elements[3].value;
        const category = form.elements[4].value;

        const newProduct = {
            id: Date.now(),
            title,
            description,
            price,
            location,
        };

        if (!products[category]) {
            products[category] = [];
        }
        products[category].push(newProduct);
        
        alert('Product added successfully!');
        render('home');
    };

    form.innerHTML = `
        <h2>Add Product</h2>
        <input type="text" placeholder="Product Title" required>
        <input type="text" placeholder="Description" required>
        <input type="number" placeholder="Price" required>
        <input type="text" placeholder="Location" required>
        <select required>
            <option value="" disabled selected>Select Category</option>
            ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
        </select>
        <button type="submit">Add Product</button>
    `;

    container.appendChild(form);
    app.appendChild(container);
}

// Initial Render
render('login');
