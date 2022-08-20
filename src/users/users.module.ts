import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-stategy';

@Module({
  imports : [TypeOrmModule.forFeature([User]),    
   JwtModule.register({
    secret: "aquarium" ,
    signOptions: { expiresIn: "60s" },
  }),] ,
  controllers: [UsersController],
  providers: [UsersService , JwtStrategy] , 
  exports : [UsersService]
})
export class UsersModule {}
