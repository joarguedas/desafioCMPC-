import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { Log } from './entities/log.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module'; // ⬅️ IMPORTANTE

@Module({
  imports: [
    SequelizeModule.forFeature([Log, User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
