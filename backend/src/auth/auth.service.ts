import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UsersMapper } from 'src/users/users.mapper';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);
    constructor(private usersService: UsersService,
        private jwtService: JwtService) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findOne(email);

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            return user;
        }

        return null;
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user.id }

        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
