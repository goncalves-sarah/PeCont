import { getCustomRepository } from "typeorm";
import { Errors } from "../errors";
import { UsersRepository } from "../repositories/UsersRepository";
import { hash } from 'bcryptjs';
import { classToPlain } from "class-transformer";

interface IUserRequest {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {

    async execute({name, email, password } : IUserRequest) {
        const usersRepository = getCustomRepository(UsersRepository);

        if(!email) {
            throw new Errors(400,"Email not received!");
        }

        const  userAlreadyExists = await usersRepository.findOne({
            email
        });

        if(userAlreadyExists){
            throw new Errors(401,"User already exists!");
        }

        //Criptografa a senha, primeiro param é a senha, segundo é o salt
        const passwordHash = await hash(password, 8);
        
        const user = usersRepository.create({
            name,
            email,
            password: passwordHash
        });

        await usersRepository.save(user);

        return classToPlain(user);
    }
}

export { CreateUserService }