import { MenuItem } from "@/types";

export const menuData: MenuItem[] = [
  // Starters - Soups
  {
    id: "soup-1",
    name: "Tomato Soup",
    price: 250,
    description: "A rich and creamy tomato soup",
    category: "Starters",
    subcategory: "Soups",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: "soup-2",
    name: "Veg Manchow Soup",
    price: 250,
    description: "A spicy and flavorful Chinese soup",
    category: "Starters",
    subcategory: "Soups",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "soup-3",
    name: "Hot & Sour Soup",
    price: 250,
    description: "A zesty and tengy soup with mixed vegetable",
    category: "Starters",
    subcategory: "Soups",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "soup-4",
    name: "Mexican Bean Soup",
    price: 250,
    description: "A hearty soup with Mexican spices and beans",
    category: "Starters",
    subcategory: "Soups",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "soup-5",
    name: "Broccoli Almond",
    price: 250,
    description: "A creamy broccoli soup with almond and cheddar",
    category: "Starters",
    subcategory: "Soups",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "soup-6",
    name: "Asian Green Soup",
    price: 250,
    description: "A healthy green vegetable soup with Asian flavour",
    category: "Starters",
    subcategory: "Soups",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Starters - Fries
  {
    id: "fries-1",
    name: "Plain Fries",
    price: 169,
    description: "Classic crispy plain fries",
    category: "Starters",
    subcategory: "Fries",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "fries-2",
    name: "Peri Peri Fries",
    price: 199,
    description: "Fries with peri peri spice mix",
    category: "Starters",
    subcategory: "Fries",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "fries-3",
    name: "Mexican Fries",
    price: 199,
    description: "Fries with Mexican spices and toppings",
    category: "Starters",
    subcategory: "Fries",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Starters - Pizzas
  {
    id: "pizza-1",
    name: "Margherita",
    price: 439,
    description: "Classic pizza with cheese toppings",
    category: "Starters",
    subcategory: "Pizzas",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "pizza-2",
    name: "Loaded Garden Pizza",
    price: 439,
    description: "Veggies topped with mozzarella cheese",
    category: "Starters",
    subcategory: "Pizzas",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "pizza-3",
    name: "Mushroom Lover Pizza",
    price: 449,
    description: "Sautéed mushrooms with Neapolitan sauce and mozzarella cheese",
    category: "Starters",
    subcategory: "Pizzas",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "pizza-4",
    name: "Eight Cheese Heaven",
    price: 499,
    description: "Pizza with eight types of cheese",
    category: "Starters",
    subcategory: "Pizzas",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "pizza-5",
    name: "Spicy Mexicana",
    price: 499,
    description: "Pizza with capsicum, jalapeno, baby corn, and mozzarella cheese",
    category: "Starters",
    subcategory: "Pizzas",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "pizza-6",
    name: "Tandoori Paneer",
    price: 509,
    description: "Paneer tikka with olives and capsicum",
    category: "Starters",
    subcategory: "Pizzas",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Starters - Sizzlers
  {
    id: "sizzler-1",
    name: "Chinese Sizzler",
    price: 549,
    description: "Manchurian balls, rice or noodles, mixed vegetables, soy sauce, spring onions, salted fries",
    category: "Starters",
    subcategory: "Sizzlers",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "sizzler-2",
    name: "Mexican Sizzler",
    price: 549,
    description: "Grilled chimichanga with Mexican rice, topped with salsa curry and sour cream",
    category: "Starters",
    subcategory: "Sizzlers",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "sizzler-3",
    name: "Sizzling Steak with Peri Peri Sauce",
    price: 599,
    description: "Cottage cheese steak with corn, cheese, jalapeno, and olives, topped with peri-peri sauce and served with mashed potatoes, rice or pasta",
    category: "Starters",
    subcategory: "Sizzlers",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "sizzler-4",
    name: "Dragon Sizzler",
    price: 549,
    description: "Dragon Paneer, bell peppers, onions, garlic, schezwan sauce, noodles or rice, mixed vegetables, soy sauce",
    category: "Starters",
    subcategory: "Sizzlers",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // More starters
  {
    id: "starter-1",
    name: "Veg Momos Steamed",
    price: 169,
    description: "Steamed vegetarian momos (6 pcs)",
    category: "Starters",
    subcategory: "Starter",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "starter-2",
    name: "Chinese Momos",
    price: 199,
    description: "Flavored momos with Chinese spices",
    category: "Starters",
    subcategory: "Starter",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "starter-3",
    name: "Fried Momos",
    price: 199,
    description: "Crispy fried momos",
    category: "Starters",
    subcategory: "Starter",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "starter-4",
    name: "Veg Manchurian Dry/Gravy",
    price: 289,
    description: "Spiced vegetable Manchurian, available dry or with gravy",
    category: "Starters",
    subcategory: "Starter",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "starter-5",
    name: "Veg-65",
    price: 289,
    description: "Mixed vegetable fingers rolled with red sauce",
    category: "Starters",
    subcategory: "Starter",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "starter-6",
    name: "Chinese Spring Roll",
    price: 299,
    description: "Vegetable spring rolls with dipping sauce",
    category: "Starters",
    subcategory: "Starter",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "starter-7",
    name: "Veg Crispy",
    price: 339,
    description: "Crispy fried vegetables with spices",
    category: "Starters",
    subcategory: "Starter",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "starter-8",
    name: "Veg Lollipop",
    price: 339,
    description: "Mixed vegetable lollipops, available dry or with gravy",
    category: "Starters",
    subcategory: "Starter",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Tandoor Starters
  {
    id: "tandoor-1",
    name: "Hara Bhara Kabab",
    price: 269,
    description: "Spiced vegetable kababs",
    category: "Starters",
    subcategory: "Tandoor Starters",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "tandoor-2",
    name: "Paneer Tikka Dry",
    price: 369,
    description: "Dry paneer tikka with spices",
    category: "Starters",
    subcategory: "Tandoor Starters",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "tandoor-3",
    name: "Malai Paneer Tikka Dry",
    price: 369,
    description: "Creamy paneer tikka",
    category: "Starters",
    subcategory: "Tandoor Starters",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "tandoor-4",
    name: "Hariyali Paneer Tikka",
    price: 369,
    description: "Green spiced paneer tikka",
    category: "Starters",
    subcategory: "Tandoor Starters",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Main Course - Assorted Papad
  {
    id: "papad-1",
    name: "Roasted Papad",
    price: 49,
    description: "Traditional thin and crispy roasted papad",
    category: "Main Course",
    subcategory: "Assorted Papad",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "papad-2",
    name: "Fried Papad",
    price: 59,
    description: "Deep-fried crispy papad",
    category: "Main Course",
    subcategory: "Assorted Papad",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "papad-3",
    name: "Masala Papad",
    price: 99,
    description: "Papad topped with spiced onion-tomato mix",
    category: "Main Course",
    subcategory: "Assorted Papad",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "papad-4",
    name: "Cheese Papad",
    price: 109,
    description: "Papad topped with cheese",
    category: "Main Course",
    subcategory: "Assorted Papad",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "papad-5",
    name: "Cheese Masala Papad",
    price: 129,
    description: "Papad topped with cheese and spiced onion-tomato mix",
    category: "Main Course",
    subcategory: "Assorted Papad",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Main Course - Paneer Ki Subji
  {
    id: "paneer-1",
    name: "Paneer Butter Masala",
    price: 399,
    description: "Red gravy with paneer cubes and added butter",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-2",
    name: "Paneer Tikka Masala",
    price: 399,
    description: "Medium spicy red gravy with onion & capsicum & roasted paneer",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-3",
    name: "Paneer Handi",
    price: 399,
    description: "Brown gravy with onion capsicum medium spicy",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-4",
    name: "Paneer Pasanda",
    price: 399,
    description: "Stuffed paneer with brown gravy",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-5",
    name: "Paneer Angara",
    price: 399,
    description: "Spicy red gravy with sizzling onion & capsicum & roasted paneer",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-6",
    name: "Shahi Paneer",
    price: 399,
    description: "Mild white gravy touching red gravy & paneer cubes",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-7",
    name: "Paneer Patiyala",
    price: 399,
    description: "Brown gravy, & papad wrapped with cheese & paneer",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-8",
    name: "Palak Paneer",
    price: 399,
    description: "Paneer cubes with spinach paste and cream",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-9",
    name: "Kadai Paneer",
    price: 399,
    description: "Diced capsicum, onions, tomato with brown gravy and khade masale",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "paneer-10",
    name: "Paneer Lababadar",
    price: 399,
    description: "Mughlai brown gravy with onion capsicum and julienne ginger",
    category: "Main Course",
    subcategory: "Paneer Ki Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Main Course - Veg Subji
  {
    id: "veg-1",
    name: "Jeera Aloo",
    price: 249,
    description: "Cubed potatoes sautéed with cumin seeds and spices",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-2",
    name: "Punjabi Dum Aloo",
    price: 329,
    description: "Stuffed baby aloo with red gravy and mixed spices",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-3",
    name: "Veg Kadai",
    price: 379,
    description: "Red gravy with mixed vegetables and added butter",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-4",
    name: "Veg Handi",
    price: 379,
    description: "Brown gravy with onion, capsicum & mixed vegetable-medium spicy",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-5",
    name: "Veg Kolhapuri",
    price: 379,
    description: "Spicy red gravy with mixed vegetables",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-6",
    name: "Veg Angara",
    price: 379,
    description: "Spicy red gravy with sizzling mixed vegetables & julienne capsicum, tomato & onion",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-7",
    name: "Veg Tofani",
    price: 379,
    description: "Red gravy sizzling with diced capsicum, onion & mixed vegetable",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-8",
    name: "Veg Tawa Masala",
    price: 379,
    description: "Finger-cut capsicum, onion, vegetables, red & brown gravy",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-9",
    name: "Veg Jaipuri",
    price: 379,
    description: "Cabbage, capsicum, onion, carrot and papad with medium brown gravy",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-10",
    name: "Veg Makhan Wala",
    price: 379,
    description: "Mixed vegetables with red gravy & makhan",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "veg-11",
    name: "Veg Diwani Handi",
    price: 379,
    description: "Mixed vegetables, mushroom, baby corn in spinach gravy",
    category: "Main Course",
    subcategory: "Veg Subji",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Main Course - Roti Adda
  {
    id: "roti-1",
    name: "Tawa Roti",
    price: 39,
    description: "Classic Indian flatbread",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-2",
    name: "Tawa Butter Roti",
    price: 49,
    description: "Buttered Indian flatbread",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-3",
    name: "Tawa Paratha",
    price: 79,
    description: "Layered Indian flatbread",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-4",
    name: "Plain Tandoori Roti",
    price: 59,
    description: "Tandoori-cooked flatbread",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-5",
    name: "Butter Tandoori Roti",
    price: 69,
    description: "Buttered tandoori flatbread",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-6",
    name: "Butter Naan",
    price: 79,
    description: "Soft naan with butter",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-7",
    name: "Lacha Paratha",
    price: 89,
    description: "Layered and flaky paratha",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-8",
    name: "Butter Kulcha/Plain",
    price: 99,
    description: "Soft kulcha with or without butter",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-9",
    name: "Missi Roti",
    price: 99,
    description: "Spiced whole wheat bread",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-10",
    name: "Garlic Naan",
    price: 109,
    description: "Naan topped with garlic",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "roti-11",
    name: "Hariyali Naan",
    price: 109,
    description: "Naan with green herbs",
    category: "Main Course",
    subcategory: "Roti Adda",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Main Course - Rice
  {
    id: "rice-1",
    name: "Steam Rice",
    price: 219,
    description: "Plain steamed basmati rice",
    category: "Main Course",
    subcategory: "Rice",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "rice-2",
    name: "Jeera Rice",
    price: 239,
    description: "Rice tempered with cumin seeds",
    category: "Main Course",
    subcategory: "Rice",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "rice-3",
    name: "Dal Khichdi (Plain/Vegetable)",
    price: 249,
    description: "Rice and lentils cooked together, plain or with vegetables",
    category: "Main Course",
    subcategory: "Rice",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "rice-4",
    name: "Veg Pulao",
    price: 259,
    description: "Rice cooked with mixed vegetables and spices",
    category: "Main Course",
    subcategory: "Rice",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "rice-5",
    name: "Veg Biryani",
    price: 299,
    description: "Fragrant rice layered with spiced vegetables",
    category: "Main Course",
    subcategory: "Rice",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "rice-6",
    name: "Veg Hyderabadi Biryani",
    price: 339,
    description: "Authentic Hyderabadi style vegetable biryani",
    category: "Main Course",
    subcategory: "Rice",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Main Course - Dal
  {
    id: "dal-1",
    name: "Dal Fry",
    price: 289,
    description: "Yellow lentils tempered with spices",
    category: "Main Course",
    subcategory: "Dal",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "dal-2",
    name: "Dal Tadka",
    price: 299,
    description: "Yellow lentils with a spicy tempering",
    category: "Main Course",
    subcategory: "Dal",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "dal-3",
    name: "Dal Makhani",
    price: 319,
    description: "Black lentils slow cooked with cream and butter",
    category: "Main Course",
    subcategory: "Dal",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Desserts
  {
    id: "dessert-1",
    name: "Vanilla Ice Cream",
    price: 99,
    description: "Classic vanilla ice cream",
    category: "Desserts",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "dessert-2",
    name: "Sizzling Hot Brownie with Ice Cream",
    price: 269,
    description: "Warm chocolate brownie served with vanilla ice cream",
    category: "Desserts",
    subcategory: "",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },

  // Beverages
  {
    id: "beverage-1",
    name: "Butter Milk Masala",
    price: 100,
    description: "Spiced butter milk",
    category: "Beverages",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-2",
    name: "Butter Milk Plain",
    price: 90,
    description: "Traditional plain butter milk",
    category: "Beverages",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-3",
    name: "Lassi Sweet",
    price: 220,
    description: "Sweet yogurt-based drink",
    category: "Beverages",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-4",
    name: "Lassi Salted",
    price: 220,
    description: "Salted yogurt-based drink",
    category: "Beverages",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-5",
    name: "Lemon Chilling Ice Tea",
    price: 140,
    description: "Refreshing lemon iced tea",
    category: "Beverages",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-6",
    name: "Peach Chilling Ice Tea",
    price: 140,
    description: "Refreshing peach iced tea",
    category: "Beverages",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-7",
    name: "Falsa Mojito",
    price: 299,
    description: "Falsa fruit mojito",
    category: "Beverages",
    subcategory: "",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-8",
    name: "Orange Martini",
    price: 240,
    description: "Non-alcoholic orange martini",
    category: "Beverages",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-9",
    name: "Cranberry Martini",
    price: 240,
    description: "Non-alcoholic cranberry martini",
    category: "Beverages",
    subcategory: "",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-10",
    name: "Exotic Margarita",
    price: 240,
    description: "Non-alcoholic exotic margarita",
    category: "Beverages",
    subcategory: "",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-11",
    name: "Foamy Litchi",
    price: 250,
    description: "Litchi-based foamy drink",
    category: "Beverages",
    subcategory: "",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-12",
    name: "Tomato Guava Blast",
    price: 245,
    description: "Refreshing blend of tomato and guava",
    category: "Beverages",
    subcategory: "",
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "beverage-13",
    name: "Apple Martini",
    price: 245,
    description: "Non-alcoholic apple martini",
    category: "Beverages",
    subcategory: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  }
];
