import { apiEndpoints, http } from '.';
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
  IUpdateProductImagesRequest,
  IPagination,
  IPaginationFilter,
} from '../interfaces/';
import { generatePaginationFilterQuery } from '../utils';

class ProductsService {
  static fetchAllProducts() {
    return http.get<IProductResponse[]>(apiEndpoints.products.getAllProducts);
  }

  static fetchAllProductsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.products.getAllProductsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<IProductResponse>>(query);
  }

  static fetchAvailableProducts() {
    return http.get<IProductResponse[]>(
      apiEndpoints.products.getAvailableProducts
    );
  }

  static fetchAvailableProductsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.products.getAvailableProductsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<IProductResponse>>(query);
  }

  static fetchProductById(id: string) {
    return http.get<IProductResponse>(apiEndpoints.products.getProductById(id));
  }

  static createProduct(request: ICreateProductRequest) {
    return http.post<IProductResponse>(
      apiEndpoints.products.createProduct,
      request
    );
  }

  static updateProduct(request: IUpdateProductRequest) {
    return http.put<IProductResponse>(
      apiEndpoints.products.updateProduct,
      request
    );
  }

  static updateProductImages(request: IUpdateProductImagesRequest) {
    return http.put<IProductResponse>(
      apiEndpoints.products.updateProductImages,
      request
    );
  }

  static deleteProduct(id: string) {
    return http.delete<IProductResponse>(
      apiEndpoints.products.deleteProduct(id)
    );
  }
}

export default ProductsService;
