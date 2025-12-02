// types/user.ts
export type UserRole = "STUDENT" | "TEACHER" | "ADMIN"; // tuỳ backend ông có gì
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
