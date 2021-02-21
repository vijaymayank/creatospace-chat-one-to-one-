import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppController } from './app/app.controller';
//import { AppController } from './app/app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {}
