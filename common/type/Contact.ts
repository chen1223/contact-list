import { ApiResponse } from 'common/type/ApiResponse';

export interface Contact {
  id?: string;
  first_name: string;
  last_name: string;
  job: string;
  description: string;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum DetailMode {
  EDIT = 'edit',
  VIEW = 'view',
}

export interface GetContactsResponse extends ApiResponse<Contact[]> {}

export interface CreateContactResponse extends ApiResponse<Contact> {}

export interface GetContactResponse extends ApiResponse<Contact | object> {}

export interface UpdateContactResponse extends ApiResponse<Contact | object> {}

export interface DeleteContactResponse extends ApiResponse<Contact | object> {}
