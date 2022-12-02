import { apiEndpoints, http } from '.';
import {
  IContactResponse,
  ICreateContactRequest,
  IPagination,
  IPaginationFilter,
  IUpdateContactRequest,
} from '../interfaces/';
import { generatePaginationFilterQuery } from '../utils';

class ContactsService {
  static fetchAllContacts() {
    return http.get<IContactResponse[]>(apiEndpoints.contacts.getAllContacts);
  }

  static fetchAllContactsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.contacts.getAllContactsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<IContactResponse>>(query);
  }

  static fetchAvailableContacts() {
    return http.get<IContactResponse[]>(
      apiEndpoints.contacts.getAvailableContacts
    );
  }

  static fetchAvailableContactsPagination(paginationFilter: IPaginationFilter) {
    let query = `${
      apiEndpoints.contacts.getAvailableContactsPagination
    }?${generatePaginationFilterQuery(paginationFilter)}`;
    return http.get<IPagination<IContactResponse>>(query);
  }

  static fetchContactById(id: string) {
    return http.get<IContactResponse>(apiEndpoints.contacts.getContactById(id));
  }

  static createContact(request: ICreateContactRequest) {
    return http.post<IContactResponse>(
      apiEndpoints.contacts.createContact,
      request
    );
  }

  static updateContact(request: IUpdateContactRequest) {
    return http.put<IContactResponse>(
      apiEndpoints.contacts.updateContact,
      request
    );
  }

  static deleteContact(id: string) {
    return http.delete<IContactResponse>(
      apiEndpoints.contacts.deleteContact(id)
    );
  }
}

export default ContactsService;
