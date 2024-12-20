import { ProductDTO } from '../models/product.dto';

export interface ProductInterface {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string | Date;
  date_revision: string | Date;
}

export interface ProductListResponse {
  data: ProductDTO[];
}
