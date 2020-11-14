export interface Role {
  id: number;
  name: string;
}


export class RolesCollection {

  private readonly _array: Role[];

  public constructor(roles: Role[]) {
    this._array = roles;
  }

  public isInRole(roleName: string): boolean {
    return !!this._array.find(r => r.name == roleName);
  }

  public getRoles(): Role[] {
    return this._array;
  }

}
