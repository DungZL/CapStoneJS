// File: admin/controller/main.js
const adminService = new AdminService();
let listData = [];
let adminModalBS = null;

// Khởi tạo Bootstrap Modal Instance an toàn
function getModalInstance() {
  if (!adminModalBS) {
    const modalEl = document.getElementById("productModal");
    if (modalEl && window.bootstrap) {
      adminModalBS = bootstrap.Modal.getOrCreateInstance(modalEl);
    }
  }
  return adminModalBS;
}

// 1. Khởi tạo danh sách khi mở trang
window.onload = () => {
  getModalInstance();
  fetchList();
};

function fetchList() {
  adminService.getList().then(res => {
    listData = res.data;
    renderTable(listData);
  }).catch(err => {
    console.error("Lỗi gọi danh sách:", err);
  });
}

// 2. Render giao diện bảng danh sách sản phẩm
function renderTable(list) {
  let content = "";
  list.forEach((item, index) => {
    let moTa = item.desc || item.description || "Chưa có mô tả";
    let hinhAnh = item.img || "https://via.placeholder.com/60?text=No+Image";
    
    content += `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td class="text-center">
          <span class="badge bg-secondary font-monospace px-2 py-1">${item.id || "N/A"}</span>
        </td>
        <td class="fw-bold text-dark">${item.name}</td>
        <td class="text-danger fw-bold">$${Number(item.price).toLocaleString()}</td>
        <td class="text-center">
          <img src="${hinhAnh}" width="60" height="60" style="object-fit: contain;" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60?text=Error'">
        </td>
        <td><small class="text-muted text-break">${moTa}</small></td>
        <td>
          <span class="badge bg-primary text-uppercase px-2 py-1">${item.type || "Khác"}</span>
        </td>
        <td class="text-center">
          <button class="btn btn-warning btn-sm me-1" onclick="editProduct('${item.id}')" title="Chỉnh sửa">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${item.id}')" title="Xóa">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  document.getElementById("tblAdminProducts").innerHTML = content;
}

// Helper: Hiển thị lỗi validation
function setFieldError(inputId, errorSpanId, message) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorSpanId);
  if (inputEl) inputEl.classList.add("is-invalid");
  if (errorEl) errorEl.innerText = message;
}

// Helper: Xóa lỗi validation
function clearFieldError(inputId, errorSpanId) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorSpanId);
  if (inputEl) inputEl.classList.remove("is-invalid");
  if (errorEl) errorEl.innerText = "";
}

// 3. Hàm Validation Form (Kiểm tra dữ liệu nhập vào)
function validateForm() {
  let isValid = true;

  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const type = document.getElementById("type").value.trim();
  const img = document.getElementById("img").value.trim();

  // 1. Kiểm tra Tên sản phẩm: Không được để trống
  if (!name) {
    setFieldError("name", "errorName", "Vui lòng nhập tên sản phẩm!");
    isValid = false;
  } else {
    clearFieldError("name", "errorName");
  }

  // 2. Kiểm tra Giá bán: Không được để trống, phải là số và lớn hơn 0
  if (!price) {
    setFieldError("price", "errorPrice", "Vui lòng nhập giá bán!");
    isValid = false;
  } else if (isNaN(price) || Number(price) <= 0) {
    setFieldError("price", "errorPrice", "Giá bán phải là số dương lớn hơn 0!");
    isValid = false;
  } else {
    clearFieldError("price", "errorPrice");
  }

  // 3. Kiểm tra Loại (Type): Bắt buộc chọn giá trị hợp lệ
  const validTypes = ["samsung", "iphone", "tablet", "laptop"];
  if (!type) {
    setFieldError("type", "errorType", "Vui lòng chọn loại sản phẩm!");
    isValid = false;
  } else if (!validTypes.includes(type.toLowerCase())) {
    setFieldError("type", "errorType", "Loại sản phẩm không hợp lệ!");
    isValid = false;
  } else {
    clearFieldError("type", "errorType");
  }

  // 4. Kiểm tra Link hình ảnh (URL): Nếu có nhập thì phải đúng URL (bắt đầu bằng http:// hoặc https://)
  const urlRegex = /^(https?:\/\/)/i;
  if (img && !urlRegex.test(img)) {
    setFieldError("img", "errorImg", "Link hình ảnh phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://)!");
    isValid = false;
  } else {
    clearFieldError("img", "errorImg");
  }

  // Các trường được phép để trống: screen, backCamera, frontCamera, desc
  clearFieldError("screen", "errorScreen");
  clearFieldError("backCamera", "errorBackCamera");
  clearFieldError("frontCamera", "errorFrontCamera");
  clearFieldError("desc", "errorDesc");

  return isValid;
}

// Hàm tự động sinh Mã ID ngẫu nhiên từ 1 - 300 (chuẩn 3 chữ số) không trùng lặp
function generateUniqueId() {
  let newId = "";
  let isDuplicate = true;
  let attempts = 0;
  const existingIds = new Set(listData.map(item => item && String(item.id).trim()));

  while (isDuplicate && attempts < 1000) {
    const randNum = Math.floor(Math.random() * 300) + 1;
    newId = String(randNum).padStart(3, "0");
    isDuplicate = existingIds.has(newId) || existingIds.has(String(randNum));
    attempts++;
  }
  return newId;
}

// 4. Reset form khi bấm "Thêm Sản Phẩm"
function resetForm() {
  document.getElementById("productForm").reset();
  const autoId = generateUniqueId();
  document.getElementById("productId").value = autoId;
  const isEditEl = document.getElementById("isEditMode");
  if (isEditEl) isEditEl.value = "false";
  document.getElementById("modalTitle").innerText = "Thêm Sản Phẩm Mới";

  // Xóa toàn bộ trạng thái lỗi
  const fields = ["name", "price", "screen", "backCamera", "frontCamera", "type", "img", "desc"];
  fields.forEach(field => {
    const capitalized = field.charAt(0).toUpperCase() + field.slice(1);
    clearFieldError(field, `error${capitalized}`);
  });
}

// 5. Đưa dữ liệu lên form để Sửa sản phẩm
function editProduct(id) {
  resetForm();
  const isEditEl = document.getElementById("isEditMode");
  if (isEditEl) isEditEl.value = "true";
  document.getElementById("modalTitle").innerText = "Cập nhật sản phẩm";

  adminService.getDetail(id).then(res => {
    const p = res.data;
    document.getElementById("productId").value = p.id;
    document.getElementById("name").value = p.name || "";
    document.getElementById("price").value = p.price || "";
    document.getElementById("img").value = p.img || "";
    document.getElementById("desc").value = p.desc || p.description || "";
    document.getElementById("screen").value = p.screen || "";
    document.getElementById("backCamera").value = p.backCamera || "";
    document.getElementById("frontCamera").value = p.frontCamera || "";

    // Chọn đúng loại sản phẩm
    const selectType = document.getElementById("type");
    if (p.type) {
      const typeLower = String(p.type).toLowerCase();
      let matched = false;
      for (let opt of selectType.options) {
        if (opt.value.toLowerCase() === typeLower) {
          selectType.value = opt.value;
          matched = true;
          break;
        }
      }
      if (!matched) selectType.value = p.type;
    } else {
      selectType.value = "";
    }

    // Mở modal
    const modal = getModalInstance();
    if (modal) modal.show();
  }).catch(err => {
    console.error("Lỗi lấy thông tin chi tiết sản phẩm:", err);
    alert("Không thể tải thông tin sản phẩm!");
  });
}

// 6. Lưu sản phẩm (Thêm mới hoặc Cập nhật)
function saveProduct() {
  // 1. Kiểm tra validation
  if (!validateForm()) return;

  const isEditEl = document.getElementById("isEditMode");
  const isEdit = isEditEl && isEditEl.value === "true";
  let id = document.getElementById("productId").value.trim();

  if (!isEdit && !id) {
    id = generateUniqueId();
    document.getElementById("productId").value = id;
  }

  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  const screen = document.getElementById("screen").value.trim();
  const backCamera = document.getElementById("backCamera").value.trim();
  const frontCamera = document.getElementById("frontCamera").value.trim();
  const img = document.getElementById("img").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const type = document.getElementById("type").value;

  // 2. Tạo đối tượng từ class Product
  const product = new Product(id, name, price, screen, backCamera, frontCamera, img, desc, type);

  const modal = getModalInstance();

  // 3. Kiểm tra Thêm mới hay Cập nhật
  if (isEdit) {
    adminService.update(id, product).then(() => {
      alert("Cập nhật sản phẩm thành công!");
      if (modal) modal.hide();
      fetchList();
    }).catch(err => {
      console.error("Lỗi cập nhật sản phẩm:", err);
      alert("Cập nhật thất bại, vui lòng thử lại!");
    });
  } else {
    adminService.add(product).then(() => {
      alert("Thêm sản phẩm mới thành công!");
      if (modal) modal.hide();
      fetchList();
    }).catch(err => {
      console.error("Lỗi thêm sản phẩm:", err);
      alert("Thêm mới thất bại, vui lòng thử lại!");
    });
  }
}

// 7. Xóa sản phẩm
function deleteProduct(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
    adminService.delete(id).then(() => {
      alert("Đã xóa sản phẩm thành công!");
      fetchList();
    }).catch(err => {
      console.error("Lỗi xóa sản phẩm:", err);
      alert("Xóa sản phẩm thất bại!");
    });
  }
}

// 8. Sắp xếp sản phẩm theo giá
function sortProduct() {
  const sortValue = document.getElementById("selSort").value;
  let sortedList = [...listData];

  if (sortValue === "asc") {
    sortedList.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortValue === "desc") {
    sortedList.sort((a, b) => Number(b.price) - Number(a.price));
  }

  renderTable(sortedList);
}

// 9. Tìm kiếm sản phẩm kèm popup gợi ý tìm kiếm
function searchProduct() {
  const keyword = document.getElementById("txtSearch").value.trim().toLowerCase();
  const suggestionBox = document.getElementById("searchSuggestions");

  const filteredList = listData.filter(item => {
    return item.name.toLowerCase().includes(keyword);
  });

  renderTable(filteredList);

  if (keyword === "" || filteredList.length === 0) {
    suggestionBox.style.display = "none";
    suggestionBox.innerHTML = "";
    return;
  }

  let htmlContent = "";
  filteredList.slice(0, 5).forEach(item => {
    const imgUrl = item.img || "https://via.placeholder.com/30?text=No+Img";
    htmlContent += `
      <button type="button" class="dropdown-item d-flex align-items-center py-2 border-bottom" onclick="selectSuggestion('${item.name.replace(/'/g, "\\'")}')">
        <img src="${imgUrl}" width="30" height="30" class="me-2 rounded" style="object-fit: contain;" onerror="this.src='https://via.placeholder.com/30?text=Err'">
        <div class="text-truncate">
          <div class="fw-bold text-dark small">${item.name}</div>
          <div class="text-danger small">$${Number(item.price).toLocaleString()}</div>
        </div>
      </button>
    `;
  });

  suggestionBox.innerHTML = htmlContent;
  suggestionBox.style.display = "block";
}

function selectSuggestion(name) {
  document.getElementById("txtSearch").value = name;
  document.getElementById("searchSuggestions").style.display = "none";
  searchProduct();
}

// Đóng dropdown gợi ý khi click ra ngoài
document.addEventListener("click", function (e) {
  const searchInput = document.getElementById("txtSearch");
  const suggestionBox = document.getElementById("searchSuggestions");
  if (searchInput && suggestionBox && !searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
    suggestionBox.style.display = "none";
  }
});