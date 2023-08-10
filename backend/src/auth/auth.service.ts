import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UsersMapper } from 'src/users/users.mapper';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findOne(email);

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            return UsersMapper.toDto(user);
        }

        return null;
    }
}
