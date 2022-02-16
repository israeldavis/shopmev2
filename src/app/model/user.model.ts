import { Role } from "./role.model";

export class User {
  id: number = 0;
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  photos: string = '';
  enabled: boolean = false;
  roles: Role[] = [];
  photosImagePath: string;
}
