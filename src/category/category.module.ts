import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PublicCategoryController } from './public-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { SystemuserModule } from '../systemuser/systemuser.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { CategoryTrashCleanupService } from './category-trash-cleanup.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    SystemuserModule,
    DashboardModule,
  ],
  controllers: [CategoryController, PublicCategoryController],
  providers: [CategoryService, CategoryTrashCleanupService],
})
export class CategoryModule { }
