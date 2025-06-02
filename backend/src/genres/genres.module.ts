import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Genre } from './entities/genre.entity';
import { Log } from '../logs/entities/log.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [SequelizeModule.forFeature([Genre, Log]), LogsModule],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService],
})
export class GenresModule {}
