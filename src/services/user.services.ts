// import { where } from "sequelize"
import UserDataSource from "../datasources/user.datasource";
import { IFindUserQuery, IUser, IUserCreationBody, IUserDataSource } from "../interfaces/user.interfaces"
// import { raw } from "express"

class UserService {
  private userDataSource: UserDataSource;
  constructor() {
    this.userDataSource = new UserDataSource();
  }

  async getUserByField(record: Partial<IUser>): Promise<IUser | null> {
    const query = { where: { ...record }, raw: true } as IFindUserQuery;
    return this.userDataSource.fetchOne(query);
  }

  async createUser(record: IUserCreationBody) {
    return this.userDataSource.create(record);
  }

  async updateRecord(
    searchBy: Partial<IUser>,
    record: Partial<IUser>
  ): Promise<void> {
    const query = { where: { ...searchBy } } as IFindUserQuery;
    await this.userDataSource.updateOne(query, record);
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    try {
      const user = await this.getUserByField({ id: userId });
      if (user) {
        await this.updateRecord({ id: userId }, { role });
      }
    } catch (error) {
      throw new Error("Failed to update user role.");
    }
  }
}

export default UserService