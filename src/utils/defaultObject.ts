import {
  ICreateAppConfigRequest,
  ICreateBrandRequest,
  ICreateCategoryRequest,
  ICreateContactRequest,
  ICreateProductRequest,
  ICreateTagRequest,
} from '../interfaces';
import { CONTACT_STATUS, STATUS } from './status';

export const defaultCreateCategoryRequest: ICreateCategoryRequest = {
  name: '',
  status: STATUS.ACTIVE,
  description: '',
};

export const defaultCreateBrandRequest: ICreateBrandRequest = {
  name: '',
  status: STATUS.ACTIVE,
  summary: '',
};

export const defaultCreateTagRequest: ICreateTagRequest = {
  title: '',
  status: STATUS.ACTIVE,
};

export const defaultCreateAppConfigRequest: ICreateAppConfigRequest = {
  key: '',
  value: '',
  status: STATUS.ACTIVE,
};

export const defaultCreateContactRequest: ICreateContactRequest = {
  content: '',
  email: '',
  phoneNumber: '',
  status: CONTACT_STATUS.PENDING,
};

export const defaultCreateProductRequest: ICreateProductRequest = {
  name: '',
  brandId: 0,
  categoryId: 0,
  imageUrl: '',
  isFavoriteProduct: false,
  isFeaturedProduct: false,
  isNewProduct: false,
  price: 0,
  quantity: 0,
  status: STATUS.ACTIVE,
  warranty: 0,
  description: '',
  salePrice: 0,
  tags: [],
};
