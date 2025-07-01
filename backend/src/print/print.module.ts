import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintController } from './print.controller';
import { PrintService } from './print.service';
import { Template } from '../template/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [PrintController],
  providers: [PrintService],
})
export class PrintModule {}