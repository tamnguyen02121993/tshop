import { apiEndpoints, http } from '.';
import {
  IAppConfigResponse,
  ICreateAppConfigRequest,
  IPagination,
  IPaginationFilter,
  IUpdateAppConfigRequest,
} from '../interfaces/';
import { generatePaginationFilterQuery } from '../utils';

class AppConfigsService {
  static fetchAllAppConfigs() {
    return http.get<IAppConfigResponse[]>(
      apiEndpoints.appConfigs.getAllAppConfigs
    );
  }

  static fetchAllAppConfigsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.appConfigs.getAllAppConfigsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<IAppConfigResponse>>(query);
  }

  static fetchAvailableAppConfigs() {
    return http.get<IAppConfigResponse[]>(
      apiEndpoints.appConfigs.getAvailableAppConfigs
    );
  }

  static fetchAvailableAppConfigsPagination(
    paginationFilter: IPaginationFilter
  ) {
    let query = `${
      apiEndpoints.appConfigs.getAvailableAppConfigsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<IAppConfigResponse>>(query);
  }

  static fetchAppConfigById(id: number) {
    return http.get<IAppConfigResponse>(
      apiEndpoints.appConfigs.getAppConfigById(id)
    );
  }

  static createAppConfig(request: ICreateAppConfigRequest) {
    return http.post<IAppConfigResponse>(
      apiEndpoints.appConfigs.createAppConfig,
      request
    );
  }

  static updateAppConfig(request: IUpdateAppConfigRequest) {
    return http.put<IAppConfigResponse>(
      apiEndpoints.appConfigs.updateAppConfig,
      request
    );
  }

  static deleteAppConfig(id: number) {
    return http.delete<IAppConfigResponse>(
      apiEndpoints.appConfigs.deleteAppConfig(id)
    );
  }
}

export default AppConfigsService;
