import { Strategy } from "passport-local";
import { UnauthorizedException, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger: Logger = new Logger(LocalStrategy.name)

    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string) {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}