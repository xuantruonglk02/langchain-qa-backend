import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [Logger, JwtService, AuthService, GoogleStrategy],
})
export class AuthModule {}
