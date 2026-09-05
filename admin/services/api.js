// File: admin/services/api.js
const BASE_URL = "https://660bd2573a0766e85dbfa7be.mockapi.io/products";
class AdminService {
  getList() { return axios({ url: BASE_URL, method: "GET" }); }
  add(product) { return axios({ url: BASE_URL, method: "POST", data: product }); }
  delete(id) { return axios({ url: `${BASE_URL}/${id}`, method: "DELETE" }); }
}