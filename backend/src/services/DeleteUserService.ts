import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

interface IUserRequest {
    id: string;
}

class DeleteUserService {

    async execute({ id } : IUserRequest) {
       
        const usersRepository = getCustomRepository(UsersRepository);

        await usersRepository.delete(id);   
    }
}

export { DeleteUserService }