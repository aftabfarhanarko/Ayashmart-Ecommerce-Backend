<p align="center">
  <a href="https://ayashmart.com/" target="_blank">
    <img src="./assets/logo.png" alt="AyashMart Logo" width="380" />
  </a>
</p>

<h1 align="center">Ayashmart-Ecommerce-Backend</h1>

<p align="center">
  Robust, Scalable & Multi-Tenant E-Commerce REST API powering <a href="https://ayashmart.com/" target="_blank"><strong>AyashMart</strong></a>.
</p>

<p align="center">
  <a href="https://ayashmart.com/" target="_blank"><img src="https://img.shields.io/badge/Website-ayashmart.com-E00000?style=flat-square&logo=googlechrome&logoColor=white" alt="AyashMart Website" /></a>
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/Framework-NestJS%2011-ea2845?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/Language-TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://vercel.com/" target="_blank"><img src="https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" /></a>
</p>

---

## 📌 Overview

**Ayashmart-Ecommerce-Backend** is the enterprise-grade backend infrastructure for **[AyashMart](https://ayashmart.com/)**. Built with modern TypeScript and [NestJS](https://nestjs.com/), it delivers high reliability, sub-tenant isolation, real-time analytics, automated invoicing, order workflows, and integrated AI-assisted capabilities.

---

## 🚀 Key Features

- **Multi-Tenant Architecture**: Schema and tenant isolation supporting superadmins, store owners, resellers, and end customers.
- **Product & Inventory Management**: Detailed product cataloging, categorization, variants, stock tracking, and promotional coupons.
- **Order Processing & Invoicing**: Automated invoice calculation, order statuses, delivery tracking, and returns/refunds handling.
- **AI-Powered Capabilities**: Integrated Cloud Vision and Voice features for intelligent image tag processing and voice-assisted workflows.
- **Fraud Detection Engine**: Built-in rules and checks to identify suspicious transactions and risky customer orders.
- **Payment & Financial Tracking**: Flexible payment provider integration, credit notes, cash logs, and revenue calculations.
- **Dynamic Role-Based Access (RBAC)**: Fine-grained permissions across superadmins, store staff, and vendors.

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM / Database**: [TypeORM](https://typeorm.io/) with [PostgreSQL](https://www.postgresql.org/)
- **Deployment**: Serverless ready with [Vercel](https://vercel.com/) / Docker / Cloud platforms
- **Integrations**: Google Cloud Vision, JWT Auth, Cache Manager

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/aftabfarhanarko/Ayashmart-Ecommerce-Backend.git
cd Ayashmart-Ecommerce-Backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the sample environment file and configure your credentials:
```bash
cp .env.example .env
```
Ensure your database credentials, JWT secrets, and API keys are properly configured.

---

## 🏃 Running the Application

```bash
# Development mode (with live reload)
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end (e2e) tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 🌐 Live Website

Visit the official website: [https://ayashmart.com/](https://ayashmart.com/)

---

## 👤 Author & Maintainer

- **Aftab Farhan Arko**
  - GitHub: [@aftabfarhanarko](https://github.com/aftabfarhanarko)
  - Website: [ayashmart.com](https://ayashmart.com/)

---

## 📄 License

This project is proprietary and confidential to **AyashMart**. Unauthorized copying or distribution is strictly prohibited.
