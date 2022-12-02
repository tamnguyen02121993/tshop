export interface IUpdateProductRequest {
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
  tags?: number[];
}
