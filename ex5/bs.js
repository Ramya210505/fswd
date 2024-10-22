document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('products');
    const searchInput = document.getElementById('search');
    const brandSelector = document.getElementById('brand-selector');
    const productCategory = document.getElementById('product-category');
    const logoutButton = document.getElementById('logout-button');

    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    const users = [
        { name: "John Doe", email: "john@example.com", password: "password123" },
        { name: "Jane Smith", email: "jane@example.com", password: "mypassword" }
    ];

    // Default products
    const defaultProducts = [
        {
            name: "HP Pavilion Laptop",
            description: "14-inch laptop with Intel Core i5, 8GB RAM, and 512GB SSD.",
            price: 550,
            brand: "HP",
            category: "electronics",
            image: "https://via.placeholder.com/100?text=HP+Laptop",
            ratings: [],
            averageRating: 0
        },
        {
            name: "Nike Air Max 270",
            description: "Stylish running shoes with breathable fabric and cushioned sole.",
            price: 120,
            brand: "Nike",
            category: "clothes",
            image: "https://via.placeholder.com/100?text=Nike+Shoes",
            ratings: [],
            averageRating: 0
        },
        {
            name: "IKEA Billy Bookcase",
            description: "Classic bookcase with adjustable shelves, perfect for any room.",
            price: 80,
            brand: "IKEA",
            category: "furniture",
            image: "https://via.placeholder.com/100?text=IKEA+Bookcase",
            ratings: [],
            averageRating: 0
        },
        {
            name: "LEGO Star Wars Millennium Falcon",
            description: "Join the Resistance with this detailed LEGO model.",
            price: 150,
            brand: "LEGO",
            category: "toys",
            image: "https://via.placeholder.com/100?text=LEGO+Millennium+Falcon",
            ratings: [],
            averageRating: 0
        },
        {
            name: "Crayola 64 Count Crayon Box",
            description: "A classic box of crayons with a wide range of colors.",
            price: 10,
            brand: "Crayola",
            category: "stationery",
            image: "https://via.placeholder.com/100?text=Crayola+Crayons",
            ratings: [],
            averageRating: 0
        }
    ];

    // Load products from local storage, or use default if none exist
    const products = JSON.parse(localStorage.getItem('products')) || defaultProducts;

    const categoryBrands = {
        stationery: ["PaperMate", "Sharpie", "Staedtler", "Crayola", "Moleskine"],
        clothes: ["H&M", "Zara", "Levi's", "Nike", "Adidas"],
        electronics: ["Samsung", "Apple", "Sony", "LG", "Dell"],
        furniture: ["IKEA", "Ashley Furniture", "La-Z-Boy", "Wayfair", "Herman Miller"],
        toys: ["LEGO", "Mattel", "Hasbro", "Fisher-Price", "Playmobil"]
    };

    // Show product form and logout button if user is logged in
    if (currentUser) {
        loginForm.classList.add('hidden');
        productForm.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        displayProducts();
    }

    document.getElementById('login-link').addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        productForm.classList.add('hidden');
        logoutButton.classList.add('hidden');
    });

    document.getElementById('signup-link').addEventListener('click', () => {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        productForm.classList.add('hidden');
        logoutButton.classList.add('hidden');
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const userExists = users.some(user => user.email === email);
        if (userExists) {
            alert('User already exists. Please use a different email.');
            return;
        }

        users.push({ name, email, password });
        signupForm.reset();
        document.getElementById('signup-success').classList.remove('hidden');
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loginForm.classList.add('hidden');
            productForm.classList.remove('hidden');
            logoutButton.classList.remove('hidden');
            document.getElementById('login-error').classList.add('hidden');
            displayProducts();
        } else {
            document.getElementById('login-error').textContent = 'Invalid email or password';
            document.getElementById('login-error').classList.remove('hidden');
        }
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        loginForm.classList.remove('hidden');
        productForm.classList.add('hidden');
        logoutButton.classList.add('hidden');
    });

    productCategory.addEventListener('change', () => {
        const selectedCategory = productCategory.value;
        brandSelector.innerHTML = '';
        if (selectedCategory) {
            const brands = categoryBrands[selectedCategory];
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelector.appendChild(option);
            });
            brandSelector.classList.remove('hidden');
        } else {
            brandSelector.classList.add('hidden');
        }
    });

    document.getElementById('add-product-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if (!currentUser) {
            alert('Please log in to add products.');
            return;
        }

        const productName = document.getElementById('product-name').value;
        const productDescription = document.getElementById('product-description').value;
        const productPrice = document.getElementById('product-price').value;
        const productBrand = brandSelector.value;
        const productCategoryValue = productCategory.value;
        const productImage = document.getElementById('product-image').files[0];

        const product = {
            name: productName,
            description: productDescription,
            price: productPrice,
            brand: productBrand,
            category: productCategoryValue,
            image: URL.createObjectURL(productImage),
            ratings: [],
            averageRating: 0
        };
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products)); // Save to local storage
        displayProducts();
        document.getElementById('add-product-form').reset();
        brandSelector.classList.add('hidden');
    });

    function displayProducts() {
        productList.innerHTML = '';
        products.forEach((product, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${product.name}</strong><br>
                <em>Brand: ${product.brand} | Category: ${product.category}</em><br>
                ${product.description}<br>
                <em>Price: $${product.price}</em><br>
                <img src="${product.image}" alt="${product.name}" style="width:100px;height:auto;"><br>
                <strong>Average Rating: ${product.averageRating.toFixed(1)} / 5</strong><br>
                <div class="stars" data-index="${index}">
                    ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-value="${i}">&#9733;</span>`).join('')}
                </div>
                <button onclick="buyProduct(${index})">Buy</button>
                <button onclick="removeProduct(${index})">Remove</button>
                <button onclick="addToCart(${index})">Add to Cart</button>
            `;
            productList.appendChild(li);
        });

        // Attach event listeners to stars for rating
        document.querySelectorAll('.stars').forEach(starContainer => {
            starContainer.addEventListener('click', (event) => {
                const index = event.currentTarget.dataset.index;
                const ratingValue = event.target.dataset.value;
                if (ratingValue) {
                    products[index].ratings.push(Number(ratingValue));
                    const sum = products[index].ratings.reduce((a, b) => a + b, 0);
                    products[index].averageRating = sum / products[index].ratings.length;
                    localStorage.setItem('products', JSON.stringify(products)); // Update local storage
                    displayProducts();
                }
            });
        });
    }

    window.buyProduct = function(index) {
        alert(`You have bought ${products[index].name}`);
    };

    window.removeProduct = function(index) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products)); // Update local storage
        displayProducts();
    };

    window.addToCart = function(index) {
        alert(`${products[index].name} has been added to your cart.`);
    };

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const items = productList.getElementsByTagName('li');

        for (let item of items) {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        }
    });
});
