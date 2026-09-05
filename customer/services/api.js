// File: customer/services/api.js
const URL_API = "https://660bd2573a0766e85dbfa7be.mockapi.io/products"; // Thay bằng link MockAPI của bạn

class CustomerService {
  getProductsApi() {
    return axios({
      url: URL_API,
      method: "GET",
    });
  }
}