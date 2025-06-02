import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './entities/book.entity';
import { LogsModule } from '../logs/logs.module'; // asegúrate que el módulo lo exporte

@Module({
  imports: [SequelizeModule.forFeature([Book]), LogsModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}