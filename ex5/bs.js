document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const appSection = document.getElementById('app-section');
    const profileSection = document.getElementById('profile-section');
    const itemsList = document.getElementById('items');

    // Show login section on page load
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        localStorage.setItem('username', username);
        showAppSection();
    });

    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('username');
        showLoginSection();
    });

    document.getElementById('item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const itemName = document.getElementById('item-name').value;
        const itemBrand = document.getElementById('item-brand').value;
        const itemPrice = document.getElementById('item-price').value;
        const itemCategory = document.getElementById('item-category').value;
        const itemImage = document.getElementById('item-image').files[0];
        const itemDescription = document.getElementById('item-description').value;

        const reader = new FileReader();
        reader.onloadend = function () {
            const item = {
                username: localStorage.getItem('username'),
                itemName,
                itemBrand,
                itemPrice,
                itemCategory,
                image: reader.result,
                itemDescription,
                timestamp: new Date().toLocaleString(),
                rating: 0,
                ratingCount: 0,
            };

            saveItem(item);
            displayItem(item);
            document.getElementById('item-form').reset();
            document.getElementById('image-preview').style.display = 'none';
        };
        if (itemImage) {
            reader.readAsDataURL(itemImage);
        }
    });

    document.getElementById('search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            item.style.display = itemName.includes(searchTerm) ? '' : 'none';
        });
    });

    function saveItem(item) {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
    }

    function loadItems() {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.forEach(displayItem);
    }

    function showAppSection() {
        loginSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        profileSection.classList.add('hidden');
        loadItems();
    }

    function showLoginSection() {
        loginSection.classList.remove('hidden');
        appSection.classList.add('hidden');
        profileSection.classList.add('hidden');
    }

    function displayItem(item) {
        const listItem = document.createElement('li');
        listItem.classList.add('item');
        listItem.innerHTML = `
            <p><strong>Posted by:</strong> ${item.username} <br><small>Posted on: ${item.timestamp}</small></p>
            <img src="${item.image}" alt="${item.itemName}" />
            <h3>${item.itemName} - $${item.itemPrice}</h3>
            <p><strong>Brand:</strong> ${item.itemBrand}</p>
            <p><strong>Category:</strong> ${item.itemCategory}</p>
            <p>${item.itemDescription}</p>
            <div class="rating">
                <span class="star" data-value="1">★</span>
                <span class="star" data-value="2">★</span>
                <span class="star" data-value="3">★</span>
                <span class="star" data-value="4">★</span>
                <span class="star" data-value="5">★</span>
            </div>
            <div class="average-rating">Average Rating: <span class="average">${item.rating}</span></div>
            <div class="button-group">
                <button class="buy-button">Buy</button>
                <button class="cart-button">Add to Cart</button>
                <button class="remove-button">Remove</button>
            </div>
        `;

        itemsList.appendChild(listItem);
        setupRating(listItem, item);
        setupRemove(listItem, item);
        setupBuy(listItem, item);
    }

    function setupRating(listItem, item) {
        const stars = listItem.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const ratingValue = parseInt(this.getAttribute('data-value'));
                item.ratingCount += 1;
                item.rating += ratingValue;
                const average = (item.rating / item.ratingCount).toFixed(1);
                listItem.querySelector('.average').textContent = average;
                stars.forEach(s => {
                    s.classList.remove('selected');
                });
                for (let i = 0; i < ratingValue; i++) {
                    stars[i].classList.add('selected');
                }
            });
        });
    }

    function setupRemove(listItem, item) {
        const removeButton = listItem.querySelector('.remove-button');
        removeButton.addEventListener('click', function() {
            listItem.remove();
            removeItemFromStorage(item);
        });
    }

    function removeItemFromStorage(item) {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items = items.filter(i => i.timestamp !== item.timestamp);
        localStorage.setItem('items', JSON.stringify(items));
    }

    function setupBuy(listItem, item) {
        const buyButton = listItem.querySelector('.buy-button');
        buyButton.addEventListener('click', function() {
            alert(`You bought: ${item.itemName} for $${item.itemPrice}`);
        });
    }

    loadItems();
});
