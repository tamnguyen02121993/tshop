import { apiEndpoints, http } from '.';
import {
  IBrandResponse,
  ICreateBrandRequest,
  IPagination,
  IPaginationFilter,
  IUpdateBrandRequest,
} from '../interfaces/';
import { generatePaginationFilterQuery } from '../utils';

class BrandsService {
  static fetchAllBrands() {
    return http.get<IBrandResponse[]>(apiEndpoints.brands.getAllBrands);
  }

  static fetchAllBrandsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.brands.getAllBrandsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<IBrandResponse>>(query);
  }

  static fetchAvailableBrands() {
    return http.get<IBrandResponse[]>(apiEndpoints.brands.getAvailableBrands);
  }

  static fetchAvailableBrandsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.brands.getAvailableBrandsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<IBrandResponse>>(query);
  }

  static fetchBrandById(id: number) {
    return http.get<IBrandResponse>(apiEndpoints.brands.getBrandById(id));
  }

  static createBrand(request: ICreateBrandRequest) {
    return http.post<IBrandResponse>(apiEndpoints.brands.createBrand, request);
  }

  static updateBrand(request: IUpdateBrandRequest) {
    return http.put<IBrandResponse>(apiEndpoints.brands.updateBrand, request);
  }

  static deleteBrand(id: number) {
    return http.delete<IBrandResponse>(apiEndpoints.brands.deleteBrand(id));
  }
}

export default BrandsService;
