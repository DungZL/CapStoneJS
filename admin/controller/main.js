// File: admin/controller/main.js
const adminService = new AdminService();
let listData = [];

window.onload = () => { fetchList(); };

function fetchList() {
  adminService.getList().then(res => {
    listData = res.data;
    // renderTable(listData); (Hàm tạo UI table)
  }).catch(err => console.log(err));
}

// 3. Tìm kiếm sản phẩm theo tên
function searchProduct() {
  const keyword = document.getElementById("txtSearch").value.toLowerCase().trim();
  const filtered = listData.filter(p => p.name.toLowerCase().includes(keyword));
  // renderTable(filtered);
}

// 4. Sắp xếp giá tiền
function sortProduct() {
  const type = document.getElementById("selSort").value;
  let sorted = [...listData];
  if(type === 'asc') sorted.sort((a,b) => a.price - b.price);
  if(type === 'desc') sorted.sort((a,b) => b.price - a.price);
  // renderTable(sorted);
}

// 2. Validation (Ví dụ áp dụng khi gọi hàm Add/Update)
function kiemTraRong(value, errorId, mess) {
  if (!value.trim()) {
    document.getElementById(errorId).innerHTML = mess;
    return false;
  }
  document.getElementById(errorId).innerHTML = "";
  return true;
}