import { Category } from "./category.model";

export class Brand {
  id: number;
  name: string;
  logo: string;
  categories: Category[];
  logoImagePath: string;
}
