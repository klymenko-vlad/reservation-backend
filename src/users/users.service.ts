import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/database-schema';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DatabaseService) {}

  async getAllUsers() {
    return this.drizzleService.db.select().from(users);
  }

  async getUserById(id: string) {
    const result = await this.drizzleService.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (!result[0]) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result[0];
  }

  async getUserByEmail(email: string) {
    const result = await this.drizzleService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0];
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException(
        `User with email ${existingUser.email} already exists`,
      );
    }

    const user = await this.drizzleService.db
      .insert(users)
      .values({
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        name: createUserDto.name ?? '',
        lastName: createUserDto.lastName ?? '',
      })
      .returning();

    return user[0];
  }
}
