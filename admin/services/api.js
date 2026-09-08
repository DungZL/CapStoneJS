// File: admin/services/api.js
const BASE_URL = "https://svcy.myclass.vn/api/ProductApi";

class AdminService {
  // 1. Lấy danh sách sản phẩm
  getList() {
    return axios({
      url: `${BASE_URL}/getall`,
      method: "GET",
    });
  }

  // 2. Lấy thông tin chi tiết 1 sản phẩm theo id
  getDetail(id) {
    return axios({
      url: `${BASE_URL}/get/${id}`,
      method: "GET",
    });
  }

  // Alias tương thích
  getById(id) {
    return this.getDetail(id);
  }

  // 3. Thêm mới sản phẩm
  add(product) {
    return axios({
      url: `${BASE_URL}/create`,
      method: "POST",
      data: product,
    });
  }

  // 4. Cập nhật sản phẩm theo id
  update(id, product) {
    return axios({
      url: `${BASE_URL}/update/${id}`,
      method: "PUT",
      data: product,
    });
  }

  // 5. Xóa sản phẩm theo id
  delete(id) {
    return axios({
      url: `${BASE_URL}/delete/${id}`,
      method: "DELETE",
    });
  }
}
