// File: admin/services/api.js
const BASE_URL = "https://6a9c24130ad174e139e903c8.mockapi.io/Products";
class AdminService {
  getList() { return axios({ url: BASE_URL, method: "GET" }); }
  add(product) { return axios({ url: BASE_URL, method: "POST", data: product }); }
  delete(id) { return axios({ url: `${BASE_URL}/${id}`, method: "DELETE" }); }
}