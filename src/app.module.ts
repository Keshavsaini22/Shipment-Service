import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from './infrastructure/database/type-orm';
import { ArriveAtStopModule } from './feature/arrive-at-stop/arrive-at-stop.module';
import { CreateShipmentModule } from './feature/create-shipment/create-shipment.module';
import { PickupAtStopModule } from './feature/pickup-at-stop/pickup.module';
import { DeliverAtStopModule } from './feature/deliver-at-stop/delivery-at-stop.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    ArriveAtStopModule,
    CreateShipmentModule,
    PickupAtStopModule,
    DeliverAtStopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
