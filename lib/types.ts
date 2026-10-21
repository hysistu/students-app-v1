export type Role = "admin" | "instructor" | "student" | "seller";
export type Status = "active" | "inactive";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
};
export type Student = {
  id: string;
  user: User;
  studentNumber: string;
  notes: string;
  status: Status;
  createdAt: string;
};
export type Course = {
  isEnrolled?: boolean;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  instructor: User;
  status: Status;
  enrollmentCount?: number;
  createdAt: string;
};
export type Enrollment = {
  id: string;
  student: User;
  course: Course;
  createdAt: string;
};
export type PageResult<T> = {
  items: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
};
export type Cart = {
  items: { course: Course; quantity: 1; subtotal: number }[];
  count: number;
  total: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  customStyling: string;
  stock: number;
  category: string;
  owner: User;
  status: Status;
  featured: boolean;
  product: {
    items: Product[];
  };
  items: Product[];
};
