import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from './entities/author.entity';
import { Log } from '../logs/entities/log.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [SequelizeModule.forFeature([Author, Log]), LogsModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
