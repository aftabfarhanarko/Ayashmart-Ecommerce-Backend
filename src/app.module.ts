import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SubdomainMiddleware } from './common/middleware/subdomain.middleware';
import { SystemUser } from './systemuser/entities/systemuser.entity';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { Global } from '@nestjs/common';

import { FraudcheckerModule } from './fraudchecker/fraudchecker.module';
// removed: import { DeliveryaddressModule } from './deliveryaddress/deliveryaddress.module';
import { CartproductsModule } from './cartproducts/cartproducts.module';
import { BannerModule } from './banner/banner.module';
import { PromocodeModule } from './promocode/promocode.module';
import { SettingModule } from './setting/setting.module';
import { HelpModule } from './help/help.module';
import { SystemuserModule } from './systemuser/systemuser.module';
import { EarningsModule } from './earnings/earnings.module';
import { OverviewModule } from './overview/overview.module';
import { createTransport } from 'nodemailer';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrivecyPolicyModule } from './privecy-policy/privecy-policy.module';
import { TremsCondetionsModule } from './trems-condetions/trems-condetions.module';
import { RefundPolicyModule } from './refund-policy/refund-policy.module';
import { ReviewsModule } from './reviews/reviews.module';
import { HealthModule } from './health/health.module';
import { TrackingModule } from './tracking/tracking.module';
import { PackageModule } from './package/package.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ThemeModule } from './theme/theme.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { SaleInvoiceModule } from './sale-invoice/sale-invoice.module';
import { CreditNoteModule } from './credit-note/credit-note.module';
import { MediaModule } from './media/media.module';
import { ResellerModule } from './reseller/reseller.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TopProductsModule } from './top-products/top-products.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Use in-memory cache; Redis removed for local/dev
    CacheModule.register({
      isGlobal: true,
      ttl: 300 * 1000,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true, // true only in development!
      logging: true, // true only in development!
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
    }),

    TypeOrmModule.forFeature([SystemUser]),

    ScheduleModule.forRoot(),

    CategoryModule,

    ProductModule,

    OrdersModule,

    UsersModule,

    PaymentsModule,
    FraudcheckerModule,

    // removed DeliveryaddressModule,
    CartproductsModule,

    BannerModule,

    PromocodeModule,

    SettingModule,

    HelpModule,

    SystemuserModule,
    EarningsModule,
    OverviewModule,
    NotificationsModule,
    DashboardModule,
    PrivecyPolicyModule,
    TremsCondetionsModule,
    RefundPolicyModule,
    ReviewsModule,
    HealthModule,
    TrackingModule,
    PackageModule,
    InvoiceModule,
    ThemeModule,
    SuperadminModule,
    SaleInvoiceModule,
    CreditNoteModule,
    MediaModule,
    ResellerModule,
    TopProductsModule,

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'MAILER_TRANSPORT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {

        return createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'xinzo.shop@gmail.com',
            pass: 'htqs fjsp ybgz lukl',
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 30000,
          greetingTimeout: 30000,
          socketTimeout: 30000,
        });
        
      },
    },
  ],
  exports: ['MAILER_TRANSPORT'],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SubdomainMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
