import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpUserDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MyExceptions } from 'src/Utils/MyExceptions';
import { UserLoginDto } from './dto/user-login.dto';
import { MyFilesHelper } from 'src/Utils/MyFilesHelper';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  saltOrRounds : number = 10;

  async signUp(signUpUserDto: SignUpUserDto) {
    try {
      let hashedPassword = await bcrypt.hash(
        signUpUserDto.password,
        this.saltOrRounds,
      );
      let newUser = this.userRepository.create({
        phoneNumber: signUpUserDto.phoneNumber,
        password: hashedPassword,
      });
      newUser = await this.userRepository.save(newUser);

      delete newUser.password;

      return newUser;
    } catch (err) {
      MyExceptions.throwException('phone number already exist', err.message);
    }
  }

  async login(loginUserDto: UserLoginDto) {
    let user = await this.findUserByPhoneNumberOrThrowWrongPhoneOrPasswordException(
      loginUserDto.phoneNumber,
    );
    try {
      let comparePasswordResult = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (comparePasswordResult) {
        delete user.password;
        return user;
      }
    } catch (error) {
      MyExceptions.throwException('something wrong', error.message);
    }
    MyExceptions.throwException('wrong phone number or password ', null);
  }


  async findAll() {
    try {
      let users = await this.userRepository.find({select : ['id' , "name" , "imageProfileUrl" , "phoneNumber" , "created_at"]});
      return users;
      } catch (error) {
        MyExceptions.throwException('something wrong while fetching users', error.message); 
      }
   }


  async findUserByPhoneNumberOrThrowWrongPhoneOrPasswordException(phoneNumber: string) {
    try {
      let user = await this.userRepository.findOne({
        where : {
        phoneNumber: phoneNumber,
    } });
      if (user) {
        return user;
      }
    } catch (error) {
      MyExceptions.throwException('something wrong ', error.message);
    }
    MyExceptions.throwException('wrong phone number or password ', null);
  }

  async update(id: number , updateUserDto: UpdateUserDto , profileImage : Express.Multer.File) {
    let user = await this.findUserByIdOrThrowException(id);
   
   // setting or updating image profile 
    if(profileImage) {
      let isUpdateProfile = user.imageProfileUrl != null; 
      if(isUpdateProfile) {
         MyFilesHelper.updateProfileImage(profileImage , user.imageProfileUrl)
      } else{
        
        let imageProfileUrl = MyFilesHelper.saveProfileImage(profileImage);
        user.imageProfileUrl = imageProfileUrl;
      }

    }
  // end setting or updating image profile 

// hashing the new password if the user wants to update password
      if(updateUserDto.password) {
        let newHashedPassword = await bcrypt.hash(
          updateUserDto.password,
          this.saltOrRounds,
        );      
      updateUserDto.password = newHashedPassword;
      }

      Object.assign(user , updateUserDto);
 
      try {
        return await this.userRepository.save(user);       
      } catch (error) {
        MyExceptions.throwException("phone number exist !" , error.message)
      }

      }


  async findUserByIdOrThrowException(id: number) {
    try {
      let user = await this.userRepository.findOne({where : {
        id: id,
      }});
      if (user) {
        return user;
      }
    } catch (error) {
      MyExceptions.throwException('something wrong ', error.message);
    }
    MyExceptions.throwException('user not found', null);
  }

  


}
