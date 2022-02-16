
export interface Category {
  id: number;
  name: string;
  alias: string;
  image: string;
  enabled: boolean;
  children: Category[];
  parent: Category;
  imagePath: string;
  hasChildren: boolean
}
