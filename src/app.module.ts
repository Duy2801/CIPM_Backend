import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ProjectModule } from './modules/project/project.module.js';
import { PaymentModule } from './modules/payment/payment.module.js';
import { NotificationModule } from './modules/notifications/notification.module.js';
import { HouseholdModule } from './modules/household/household.module.js';
import { ProjectProgressUpdateModule } from './modules/project-progress-update/project-progress-update.module.js';
import { TeamModule } from './modules/team/team.module.js';
import { PermissionModule } from './modules/permission/permission.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TeamModule,
    PermissionModule,
    ProjectModule,
    ProjectProgressUpdateModule,
    PaymentModule,
    NotificationModule,
    HouseholdModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'cipm-service',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
