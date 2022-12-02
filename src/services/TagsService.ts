import { apiEndpoints, http } from '.';
import {
  ITagResponse,
  ICreateTagRequest,
  IUpdateTagRequest,
  IPagination,
  IPaginationFilter,
} from '../interfaces/';
import { generatePaginationFilterQuery } from '../utils';

class TagsService {
  static fetchAllTags() {
    return http.get<ITagResponse[]>(apiEndpoints.tags.getAllTags);
  }

  static fetchAllTagsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.tags.getAllTagsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<ITagResponse>>(query);
  }

  static fetchAvailableTags() {
    return http.get<ITagResponse[]>(apiEndpoints.tags.getAvailableTags);
  }

  static fetchAvailableTagsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.tags.getAvailableTagsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<ITagResponse>>(query);
  }

  static fetchTagById(id: number) {
    return http.get<ITagResponse>(apiEndpoints.tags.getTagById(id));
  }

  static createTag(request: ICreateTagRequest) {
    return http.post<ITagResponse>(apiEndpoints.tags.createTag, request);
  }

  static updateTag(request: IUpdateTagRequest) {
    return http.put<ITagResponse>(apiEndpoints.tags.updateTag, request);
  }

  static deleteTag(id: number) {
    return http.delete<ITagResponse>(apiEndpoints.tags.deleteTag(id));
  }
}

export default TagsService;
