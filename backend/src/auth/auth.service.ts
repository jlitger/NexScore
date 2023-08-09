import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, passwordHash: string) {
        const user = await this.usersService.findOne(email);

        if (user && user.passwordHash === passwordHash) {
            return user;
        }

        return null;
    }
}
