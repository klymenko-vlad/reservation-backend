import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { properties } from '../database/schema/property.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PropertiesService {
  constructor(private readonly drizzleService: DatabaseService) {}

  async createProperty(userId: string, createPropertyDto: CreatePropertyDto) {
    const result = await this.drizzleService.db
      .insert(properties)
      .values({ ...createPropertyDto, userId })
      .returning();

    return result[0];
  }

  async findAllProperties() {
    return this.drizzleService.db.select().from(properties);
  }

  async findOneProperty(id: string) {
    const result = await this.drizzleService.db
      .select()
      .from(properties)
      .where(eq(properties.id, id));

    if (!result[0]) {
      throw new NotFoundException('Property not found');
    }

    return result[0];
  }
}
