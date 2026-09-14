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
      filterAndSortProducts();
    })
    .catch((err) => console.log(err));
}

// 2 & 3. Hàm tạo giao diện hiển thị danh sách sản phẩm
function renderProducts(list) {
  if (!list || list.length === 0) {
    document.getElementById("productList").innerHTML = `
      <div class="col-12 text-center py-5 text-muted">
        <i class="fa fa-box-open fs-1 mb-3 d-block"></i>
        <h5>Không tìm thấy sản phẩm phù hợp</h5>
        <p class="small">Vui lòng thử chọn lại danh mục hoặc bộ lọc khác.</p>
      </div>
    `;
    return;
  }

  let content = "";
  list.forEach((product) => {
    const rawDesc = product.desc || product.description || "";
    const desc = typeof rawDesc === "string" ? rawDesc.trim() : String(rawDesc);
    const hasDesc = desc && desc.toLowerCase() !== "undefined" && desc !== "";
    const descHtml = hasDesc
      ? `<p class="card-text text-muted small product-desc mb-3">${desc}</p>`
      : "";

    content += `
      <div class="col-12 col-md-4 col-lg-3 mb-4">
        <div class="card h-100 shadow-sm border-0 product-card">
          <img src="${product.img}" class="card-img-top p-3" alt="${product.name}" style="height: 250px; object-fit: contain;" onerror="this.src='https://via.placeholder.com/250?text=No+Image'">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <h5 class="text-danger fw-bold">$${Number(product.price).toLocaleString()}</h5>
            ${descHtml}
            <button class="btn btn-primary mt-auto w-100" onclick="addToCart('${product.id}')">
              <i class="fa fa-shopping-cart me-1"></i> Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById("productList").innerHTML = content;
}

// 4. Lọc & Sắp xếp sản phẩm
function filterAndSortProducts() {
  const filterEl = document.getElementById("selectFilter");
  const sortEl = document.getElementById("selSort");

  const type = filterEl ? filterEl.value.toLowerCase() : "all";
  const sortValue = sortEl ? sortEl.value : "";

  // 1. Lọc theo loại sản phẩm
  let result = [...productList];
  if (type && type !== "all") {
    result = result.filter((p) => (p.type || "").toLowerCase() === type);
  }

  // 2. Sắp xếp theo giá tiền
  if (sortValue === "asc") {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortValue === "desc") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  }

  renderProducts(result);
}

function filterProduct() {
  filterAndSortProducts();
}

function sortProduct() {
  filterAndSortProducts();
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
  showToast(`Đã thêm <strong>${product.name}</strong> vào giỏ hàng thành công!`);
}

// Hiển thị thông báo Toast
function showToast(message) {
  const toastEl = document.getElementById("cartToast");
  if (!toastEl) return;
  const toastMsgEl = document.getElementById("toastMessage");
  if (toastMsgEl && message) {
    toastMsgEl.innerHTML = message;
  }
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });
  toast.show();
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