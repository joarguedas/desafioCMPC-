export interface Log {
  id: number;
  tableName: string;
  action: string;
  userId: number;
  user?: { email: string };
  description: string;
  createdAt: string;
  updatedAt: string;
}
