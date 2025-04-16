
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  image: string;  // Made this required
  isSpecial?: boolean;
}
