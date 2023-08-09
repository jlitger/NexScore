import { Strategy } from "passport-local";
import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";

export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, passwordHash: string) {
        const user = await this.authService.validateUser(email, passwordHash);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}