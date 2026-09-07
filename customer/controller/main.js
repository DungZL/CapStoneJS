// File: customer/controller/main.js
const customerService = new CustomerService();
let productList = [];
let cart = [];

// 1. Khởi tạo và Load dữ liệu
window.onload = function () {
  fetchProducts();
  loadCartFromLocalStorage();
};

function fetchProducts() {
  customerService.getProductsApi()
    .then((res) => {
      productList = res.data;
      renderProducts(productList);
    })
    .catch((err) => console.log(err));
}

// 2 & 3. Hàm tạo giao diện hiển thị danh sách sản phẩm
function renderProducts(list) {
  let content = "";
  list.forEach((product) => {
    content += `
      <div class="col-12 col-md-4 col-lg-3 mb-4">
        <div class="card h-100">
          <img src="${product.img}" class="card-img-top p-3" alt="${product.name}" style="height: 250px; object-fit: contain;">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted">${product.desc}</p>
            <h5 class="text-danger">$${product.price}</h5>
            <button class="btn btn-primary mt-2" onclick="addToCart('${product.id}')">Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById("productList").innerHTML = content;
}

// 4. Lọc sản phẩm
function filterProduct() {
  const type = document.getElementById("selectFilter").value.toLowerCase();
  if (type === "all") {
    renderProducts(productList);
  } else {
    const filteredList = productList.filter((p) => (p.type || "").toLowerCase() === type);
    renderProducts(filteredList);
  }
}

// 5, 6, 7. Thêm vào giỏ hàng
function addToCart(id) {
  const product = productList.find((p) => p.id === id);
  if (!product) return;

  const index = cart.findIndex((item) => item.product.id === id);
  if (index !== -1) {
    cart[index].quantity += 1; // Nếu có rồi thì tăng số lượng
  } else {
    const cartItem = new CartItem(product, 1); // Tạo đối tượng giỏ hàng mới
    cart.push(cartItem);
  }
  
  renderCart();
  saveCartToLocalStorage();
}

// 8, 10. In giỏ hàng ra màn hình và tính tổng
function renderCart() {
  let content = "";
  let totalPrice = 0;
  let totalCount = 0;

  cart.forEach((item) => {
    let priceItem = item.product.price * item.quantity;
    totalPrice += priceItem;
    totalCount += item.quantity;

    content += `
      <tr>
        <td><img src="${item.product.img}" width="50" alt="${item.product.name}"></td>
        <td>${item.product.name}</td>
        <td>$${item.product.price}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity('${item.product.id}', -1)">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity('${item.product.id}', 1)">+</button>
        </td>
        <td>$${priceItem}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removeCartItem('${item.product.id}')"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `;
  });

  document.getElementById("cartList").innerHTML = content;
  document.getElementById("totalPrice").innerHTML = totalPrice.toLocaleString();
  document.getElementById("cartCount").innerHTML = totalCount;
}

// 9. Tăng giảm số lượng
function changeQuantity(id, num) {
  const index = cart.findIndex((item) => item.product.id === id);
  if (index !== -1) {
    cart[index].quantity += num;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  renderCart();
  saveCartToLocalStorage();
}

// 13. Xóa sản phẩm khỏi giỏ
function removeCartItem(id) {
  cart = cart.filter((item) => item.product.id !== id);
  renderCart();
  saveCartToLocalStorage();
}

// 12. Thanh toán (Clear giỏ hàng)
function checkout() {
  if(cart.length === 0) return alert("Giỏ hàng rỗng!");
  alert("Thanh toán thành công!");
  cart = [];
  renderCart();
  saveCartToLocalStorage();
}

// 11. LocalStorage
function saveCartToLocalStorage() {
  localStorage.setItem("CART_CYBER", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const data = localStorage.getItem("CART_CYBER");
  if (data) {
    cart = JSON.parse(data);
    renderCart();
  }
}