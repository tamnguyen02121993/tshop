import { IProductImageResponse } from '.';

export interface IProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  quantity: number;
  warranty: number;
  imageUrl: string;
  status: string;
  isNewProduct: boolean;
  isFeaturedProduct: boolean;
  isFavoriteProduct: boolean;
  categoryId: number;
  brandId: number;
  images: IProductImageResponse[];
  tags: number[];
}
