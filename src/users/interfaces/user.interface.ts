export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }