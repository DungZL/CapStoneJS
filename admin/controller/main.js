const adminService = new AdminService();
 let listData = [];
 let adminModalBS = null;
 
 window.onload = () => {
   // Khởi tạo đối tượng Modal của Bootstrap 5
   adminModalBS = new bootstrap.Modal(document.getElementById('adminModal'));
   fetchList(); 
 };
 
 function fetchList() {
   adminService.getList().then(res => {
     listData = res.data;
     renderTable(listData); 
   }).catch(err => console.log(err));
 }
 
 function renderTable(list) {
   let content = "";
   list.forEach((item, index) => {
     content += `
       <tr>
         <td>${index + 1}</td>
         <td class="fw-bold">${item.name}</td>
         <td>$${Number(item.price).toLocaleString()}</td>
         <td><img src="${item.img}" width="60" alt="${item.name}" /></td>
         <td><small>${item.desc}</small></td>
         <td><span class="badge bg-info text-dark">${item.type}</span></td>
         <td>
           <button class="btn btn-warning btn-sm me-1" onclick="editProduct('${item.id}')">
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
 
 function searchProduct() {
   const keyword = document.getElementById("txtSearch").value.toLowerCase().trim();
   const filtered = listData.filter(p => p.name.toLowerCase().includes(keyword));
   renderTable(filtered);
 }
 
 function sortProduct() {
   const type = document.getElementById("selSort").value;
   let sorted = [...listData];
   if(type === 'asc') sorted.sort((a,b) => Number(a.price) - Number(b.price));
   if(type === 'desc') sorted.sort((a,b) => Number(b.price) - Number(a.price));
   renderTable(sorted);
 }
 
 function resetForm() {
   document.getElementById("modalTitle").innerText = "Thêm Sản Phẩm Mới";
   document.getElementById("productForm").reset();
   document.getElementById("productId").value = "";
   // Xóa các dòng thông báo lỗi
   const errorSpans = document.querySelectorAll(".text-danger.small");
   errorSpans.forEach(span => span.innerText = "");
 }
 
 // Các hàm Thêm (add), Cập nhật (update), Xóa (delete) sẽ được viết tiếp theo cấu trúc này
 function deleteProduct(id) {
     if(confirm('Bạn có chắc muốn xóa?')) {
         adminService.delete(id).then(res => {
             fetchList();
             alert('Xóa thành công');
         }).catch(err => console.log(err))
     }
 }