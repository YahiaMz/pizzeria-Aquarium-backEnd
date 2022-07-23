import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { MyFilesHelper } from 'src/Utils/MyFilesHelper';
import { ResponseStatus } from 'src/Utils/ResponseStatus';
import { SignUpUserDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  async signup(@Body() signUpUserDto: SignUpUserDto) {
    let newUser = await this.usersService.signUp(signUpUserDto);
    return ResponseStatus.success_response(newUser);
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    let loggedUser = await this.usersService.login(userLoginDto);
    return ResponseStatus.success_response(loggedUser);
  }
  

  @Get()
  async findAll() {
    let users = await this.usersService.findAll();
    return ResponseStatus.success_response(users);
  }


  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateUser (@Param('id') userId : string , @Body() updateDto : UpdateUserDto , @UploadedFile() profileImage : Express.Multer.File ) {
   
    if(profileImage && !MyFilesHelper.isOfTypePngOrJpeg(profileImage.mimetype)) {
       return ResponseStatus.failed_response('image must be of type {.png , .jpeg ,}')
    }

    let updatedUser = await this.usersService.update(+userId , updateDto , profileImage )
    return ResponseStatus.success_response(updatedUser);
  }


  @Get('/images/:profile_ImageUrl')
  async fetchProfilePicture(@Param('profile_ImageUrl') profileImageUrl : string  ,@Res() _mRes ) {
    let profileImage = await _mRes.sendFile(join(process.cwd() , MyFilesHelper.PROFILE_IMAGES_PATH + profileImageUrl ))
   return profileImage;
  }


}
