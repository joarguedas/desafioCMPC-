import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Publisher } from './entities/publisher.entity';
import { Log } from '../logs/entities/log.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [SequelizeModule.forFeature([Publisher, Log]), LogsModule],
  controllers: [PublishersController],
  providers: [PublishersService],
  exports: [PublishersService],
})
export class PublishersModule {}
