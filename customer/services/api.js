// File: customer/services/api.js
const URL_API = "https://svcy.myclass.vn/api/ProductApi/getall"; // Thay bằng link MockAPI của bạn

class CustomerService {
  getProductsApi() {
    return axios({
      url: URL_API,
      method: "GET",
    });
  }
}