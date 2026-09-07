const adminService = new AdminService();
let listData = [];

// 1. Khởi tạo danh sách khi mở trang
window.onload = () => { fetchList(); };

function fetchList() {
  adminService.getList().then(res => {
    listData = res.data;
    renderTable(listData);
  }).catch(err => console.error("Lỗi gọi danh sách:", err));
}

// 2. Render giao diện bảng
function renderTable(list) {
  let content = "";
  list.forEach((item, index) => {
    let moTa = item.description || item.desc || "Chưa có mô tả";
    
    content += `
      <tr>
        <td>${index + 1}</td>
        <td class="fw-bold">${item.name}</td>
        <td class="text-danger fw-bold">$${item.price}</td>
        <td><img src="${item.img}" width="60" style="object-fit: contain;" alt="Lỗi ảnh"></td>
        <td><small>${moTa}</small></td>
        <td><span class="badge bg-info text-dark text-capitalize">${item.type || "Khác"}</span></td>
        <td>
          <button class="btn btn-warning btn-sm me-1" onclick="editProduct('${item.id}')" data-bs-toggle="modal" data-bs-target="#productModal">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${item.id}')">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  document.getElementById("tblAdminProducts").innerHTML = content;
}

// 3. Reset form khi bấm Thêm Mới
function resetForm() {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("modalTitle").innerText = "Thêm Sản Phẩm Mới";
}

// 4. Đọc dữ liệu từ form
function getFormData() {
  const id = document.getElementById("productId").value;
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value;
  const screen = document.getElementById("screen") ? document.getElementById("screen").value.trim() : "";
  const backCamera = document.getElementById("backCamera") ? document.getElementById("backCamera").value.trim() : "";
  const frontCamera = document.getElementById("frontCamera") ? document.getElementById("frontCamera").value.trim() : "";
  const img = document.getElementById("img").value.trim();
  const description = document.getElementById("desc").value.trim();
  const type = document.getElementById("type").value;

  if (!name || !price || !img) {
    alert("Vui lòng nhập Tên, Giá và Link Hình Ảnh!");
    return null;
  }

  if (!type) {
    alert("Vui lòng chọn Loại sản phẩm!");
    return null;
  }

  return {
    id: id ? id : String(Date.now()),
    name: name,
    price: price,
    screen: screen,
    backCamera: backCamera,
    frontCamera: frontCamera,
    img: img,
    desc: description,
    description: description,
    type: type,
    deleted: false
  };
}

// 5. Hàm Thêm mới hoặc Cập nhật sản phẩm
function saveProduct() {
  const product = getFormData();
  if (!product) return;

  const id = document.getElementById("productId").value;

  if (id) {
    adminService.update(id, product).then(() => {
      alert("Cập nhật thành công!");
      closeModal();
      fetchList();
    }).catch(err => console.error("Lỗi cập nhật:", err));
  } else {
    adminService.add(product).then(() => {
      alert("Thêm sản phẩm thành công!");
      closeModal();
      fetchList();
    }).catch(err => console.error("Lỗi thêm mới:", err));
  }
}

// 6. Đưa dữ liệu lên form để Sửa
function editProduct(id) {
  document.getElementById("modalTitle").innerText = "Chỉnh Sửa Sản Phẩm";
  adminService.getById(id).then(res => {
    const p = res.data;
    document.getElementById("productId").value = p.id;
    document.getElementById("name").value = p.name || "";
    document.getElementById("price").value = p.price || "";
    document.getElementById("img").value = p.img || "";
    document.getElementById("desc").value = p.description || p.desc || "";
    
    // Gán loại sản phẩm (hỗ trợ so sánh không phân biệt chữ hoa/thường)
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
      if (!matched) {
        selectType.value = p.type;
      }
    } else {
      selectType.value = "";
    }
    
    if(document.getElementById("screen")) document.getElementById("screen").value = p.screen || "";
    if(document.getElementById("backCamera")) document.getElementById("backCamera").value = p.backCamera || "";
    if(document.getElementById("frontCamera")) document.getElementById("frontCamera").value = p.frontCamera || "";

  }).catch(err => console.error("Lỗi lấy thông tin:", err));
}

// 7. Xóa sản phẩm
function deleteProduct(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    adminService.delete(id).then(() => {
      fetchList();
    }).catch(err => console.error("Lỗi xóa:", err));
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

// 9. Tìm kiếm sản phẩm kèm popup gợi ý kiểu Google
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
    htmlContent += `
      <button type="button" class="dropdown-item d-flex align-items-center py-2 border-bottom" onclick="selectSuggestion('${item.name.replace(/'/g, "\\'")}')">
        <img src="${item.img}" width="30" height="30" class="me-2 rounded" style="object-fit: contain;">
        <div class="text-truncate">
          <div class="fw-bold text-dark small">${item.name}</div>
          <div class="text-danger small">$${item.price}</div>
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

document.addEventListener("click", function(e) {
  const searchInput = document.getElementById("txtSearch");
  const suggestionBox = document.getElementById("searchSuggestions");
  if (searchInput && suggestionBox && !searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
    suggestionBox.style.display = "none";
  }
});

// Hàm hỗ trợ tắt form popup an toàn
function closeModal() {
  const modalElement = document.getElementById('productModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if(modalInstance) {
      modalInstance.hide();
  } else {
      document.querySelector('.btn-close').click();
  }
}