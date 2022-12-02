import { apiEndpoints, http } from '.';
import {
  ICategoryResponse,
  ICreateCategoryRequest,
  IPagination,
  IPaginationFilter,
  IUpdateCategoryRequest,
} from '../interfaces/';
import { generatePaginationFilterQuery } from '../utils';

class CategoriesService {
  static fetchAllCategories() {
    return http.get<ICategoryResponse[]>(
      apiEndpoints.categories.getAllCategories
    );
  }

  static fetchAllCategoriesPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.categories.getAllCategoriesPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<ICategoryResponse>>(query);
  }

  static fetchAvailableCategories() {
    return http.get<ICategoryResponse[]>(
      apiEndpoints.categories.getAvailableCategories
    );
  }

  static fetchAvailableCategoriesPagination(
    paginationFilter: IPaginationFilter
  ) {
    let query = `${
      apiEndpoints.categories.getAvailableCategoriesPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<ICategoryResponse>>(query);
  }

  static fetchCategoryById(id: number) {
    return http.get<ICategoryResponse>(
      apiEndpoints.categories.getCategoryById(id)
    );
  }

  static createCategory(request: ICreateCategoryRequest) {
    return http.post<ICategoryResponse>(
      apiEndpoints.categories.createCategory,
      request
    );
  }

  static updateCategory(request: IUpdateCategoryRequest) {
    return http.put<ICategoryResponse>(
      apiEndpoints.categories.updateCategory,
      request
    );
  }

  static deleteCategory(id: number) {
    return http.delete<ICategoryResponse>(
      apiEndpoints.categories.deleteCategory(id)
    );
  }
}

export default CategoriesService;
