# Multi-Tenant Implementation Guide

This document outlines the multi-tenant implementation with auto-generated `companyId` for the e-commerce backend.

## Overview

Every system user has a unique auto-generated `companyId` (format: `COMP-000001`, `COMP-000002`, etc.). All entities are filtered by `companyId` to ensure data isolation between tenants.

## Implementation Status

### ✅ Completed

1. **CompanyId Service** (`src/common/services/company-id.service.ts`)
   - Auto-generates companyId in format `COMP-000001`, `COMP-000002`, etc.
   - Fetches last created companyId and increments

2. **SystemUser Entity** (`src/systemuser/entities/systemuser.entity.ts`)
   - Added `companyId` field (unique, required)
   - Added `subdomain` field (unique, optional) for wildcard domain support

3. **SystemUser Service** (`src/systemuser/systemuser.service.ts`)
   - Auto-generates companyId on user creation
   - Includes companyId in JWT payload
   - Handles `subdomain` assignment and uniqueness check

4. **Wildcard Domain Support**
   - **SubdomainMiddleware** (`src/common/middleware/subdomain.middleware.ts`)
     - Intercepts requests
     - Extracts subdomain from hostname
     - Resolves `companyId` from `SystemUser` table
     - Injects `companyId` into `req.query` and `req` object
   - Registered in `AppModule` globally

5. **JWT Strategy** (`src/systemuser/jwt.strategy.ts`)
   - Returns companyId in validated payload

6. **Guards & Decorators**
   - `CompanyIdGuard` (`src/common/guards/company-id.guard.ts`) - Extracts companyId from JWT
   - `@CompanyId()` decorator (`src/common/decorators/company-id.decorator.ts`) - Parameter decorator (supports both JWT and Subdomain resolution)

7. **Entities Updated** (all have `companyId` column):
   - ✅ SystemUser
   - ✅ Product
   - ✅ Category
   - ✅ Order
   - ✅ OrderItem
   - ✅ User
   - ✅ Inventory
   - ✅ CartProduct
   - ✅ Banner
   - ✅ Promocode
   - ✅ Setting
   - ✅ Help

8. **Services Updated** (with companyId filtering):
   - ✅ ProductService
   - ✅ CategoryService
   - ✅ OrderService
   - ✅ UsersService

### ⚠️ Remaining Services to Update

The following services need to be updated following the same pattern:

1. **InventoryService** (`src/inventory/inventory.service.ts`)
2. **CartproductsService** (`src/cartproducts/cartproducts.service.ts`)
3. **BannerService** (`src/banner/banner.service.ts`)
4. **PromocodeService** (`src/promocode/promocode.service.ts`)
5. **SettingService** (`src/setting/setting.service.ts`)
6. **HelpService** (`src/help/help.service.ts`)
7. **OrdersitemService** (`src/ordersitem/ordersitem.service.ts`)

## Implementation Pattern

### 1. Service Method Pattern

All service methods should accept `companyId` as a parameter and filter queries:

```typescript
// Before
async findAll(): Promise<Entity[]> {
  return this.repo.find();
}

// After
async findAll(companyId: string): Promise<Entity[]> {
  return this.repo.find({ 
    where: { companyId } 
  });
}
```

### 2. Create Method Pattern

Always set `companyId` when creating entities:

```typescript
async create(dto: CreateDto, companyId: string): Promise<Entity> {
  const entity = this.repo.create({
    ...dto,
    companyId, // Always include companyId
  });
  return this.repo.save(entity);
}
```

### 3. Find Methods Pattern

Always filter by `companyId`:
