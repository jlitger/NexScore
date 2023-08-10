import { UserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";

const UsersMapper = {
    toDto(userEntity: User): UserDto {
        return {
            id: userEntity.id,
            email: userEntity.email,
        };
    }
};

export { UsersMapper };

