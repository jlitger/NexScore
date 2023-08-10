import { Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './local.guard';
import { UsersMapper } from 'src/users/users.mapper';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
