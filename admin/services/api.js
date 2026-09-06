const BASE_URL = "https://svcy.myclass.vn/api/ProductApi";

class AdminService {
  // 1. Lấy danh sách
  getList() { return axios({ url: `${BASE_URL}/getall`, method: "GET" }); }
  
  // 2. Thêm mới - Thay đuôi /create bằng link POST chính xác trên Swagger
  add(product) { return axios({ url: "https://svcy.myclass.vn/api/ProductApi/create", method: "POST", data: product }); }
  
  // 3. Xóa - Thay đuôi /delete/ bằng link DELETE chính xác trên Swagger
  delete(id) { return axios({ url: `${BASE_URL}/delete/${id}`, method: "DELETE" }); }
  
  // 4. Lấy chi tiết 1 sản phẩm
  getById(id) { return axios({ url: `${BASE_URL}/get/${id}`, method: "GET" }); }
  
  // 5. Cập nhật - Thay đuôi /update/ bằng link PUT chính xác trên Swagger
  update(id, product) { return axios({ url: `${BASE_URL}/update/${id}`, method: "PUT", data: product }); }
}
