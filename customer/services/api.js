// File: customer/services/api.js
const URL_API = "https://6a9c24130ad174e139e903c8.mockapi.io/Products"; // Thay bằng link MockAPI của bạn

class CustomerService {
  getProductsApi() {
    return axios({
      url: URL_API,
      method: "GET",
    });
  }
}