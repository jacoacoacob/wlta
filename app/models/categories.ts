
export interface Category {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  color: string | undefined;
  description: string | undefined;
}

const categoryList: Category[] = [
  {
    id: "1",
    created_at: "",
    updated_at: "",
    user_id: "123",
    name: "Admin",
    color: "#ffaacc",
    description: "Anything involving scheduling, planning future activities, etc."
  },
  {
    id: "2",
    created_at: "",
    updated_at: "",
    user_id: "123",
    name: "Cleaning",
    color: "#aaccee",
    description: "Anything involving cleaning",
  },
]

export function getCategoryById(categoryId: string) {
  return categoryList.find((category) => category.id === categoryId);
}

export function getCategoryList() {
  return categoryList;
}

export function addCategory(category: Category) {
  categoryList.push(category);
  
  return category;
}

export function updateCategory(category: Category) {
  const categoryIndex = categoryList.findIndex((c) => c.id === category.id);
  
  categoryList.splice(categoryIndex, 1, category);

  return category;
}