import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MyExceptions } from 'src/Utils/MyExceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    handleRequest(err, user , _) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user ) {
            MyExceptions.throwException("not authorized" , "wrong token");
        }
        return user;
      }
}
