let products = JSON.parse(localStorage.getItem('products')) || [];

const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');
const filterInput = document.getElementById('filter');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addProduct();
});

searchInput.addEventListener('input', displayProducts);
filterInput.addEventListener('input', displayProducts);

function addProduct() {
    const title = document.getElementById('title').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const image = document.getElementById('image').value.trim();
    const category = document.getElementById('category').value.trim();

    if (!title || isNaN(price)) {
        alert('Please provide a valid title and price.');
        return;
    }

    const product = { id: Date.now(), title, price, image, category };
    products.push(product);
    saveProducts();
    displayProducts();
    form.reset();

    highlightProduct(product.id);
}

function highlightProduct(id) {
    setTimeout(() => {
        const productElement = document.querySelector(`.product[data-id="${id}"]`);
        if (productElement) {
            productElement.classList.add('highlight');
            setTimeout(() => productElement.classList.remove('highlight'), 2000);
        }
    }, 100);
}

function displayProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterTerm = filterInput.value.toLowerCase();

    productList.innerHTML = '';
    products
        .filter(product => 
            product.title.toLowerCase().includes(searchTerm) &&
            product.category.toLowerCase().includes(filterTerm)
        )
        .forEach(product => addProductToList(product));
}

function addProductToList(product) {
    const div = document.createElement('div');
    div.className = 'product';
    div.setAttribute('data-id', product.id);

    div.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/50'}" alt="${product.title}">
        <span>${product.title}</span>
        <span>$${product.price.toFixed(2)}</span>
        <span>${product.category}</span>
        <button onclick="editProduct(${product.id})">Edit</button>
        <button onclick="deleteProduct(${product.id})">Delete</button>
    `;

    productList.appendChild(div);
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProducts() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    displayProducts();
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('title').value = product.title;
        document.getElementById('price').value = product.price;
        document.getElementById('image').value = product.image;
        document.getElementById('category').value = product.category;

        deleteProduct(id);
    }
}

function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    saveProducts();
    displayProducts();
}

loadProducts();