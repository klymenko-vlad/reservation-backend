import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePropertyDto } from './dto/create-property.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type User } from '../database/schema';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { type UpdateReservationDto } from '../reservations/dto/update-reservation.dto';

@Controller('properties')
@UseGuards(JwtAuthGuard, RbacGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Permissions('property:create')
  createProperty(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: User,
  ) {
    return this.propertiesService.createProperty(user.id, createPropertyDto);
  }

  @Get()
  @Permissions('property:read')
  getAllProperties() {
    return this.propertiesService.findAllProperties();
  }

  @Get(':id')
  @Permissions('property:read')
  getPropertyById(@Param('id') id: string) {
    return this.propertiesService.findOneProperty(id);
  }

  @Delete(':id')
  @Permissions('property:delete')
  deletePropertyById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.propertiesService.findOnePropertyAndDelete(id, user.id);
  }

  @Patch(':id')
  @Permissions('property:update')
  updatePropertyById(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateData: UpdateReservationDto,
  ) {
    return this.propertiesService.findOnePropertyAndUpdate(
      id,
      user.id,
      updateData,
    );
  }
}
