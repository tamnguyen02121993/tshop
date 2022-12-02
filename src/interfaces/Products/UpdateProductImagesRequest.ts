import { IProductImageRequest } from '.';

export interface IUpdateProductImagesRequest {
  id: string;
  images: IProductImageRequest[];
}
