import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from "typeorm";
import { Errors } from "../errors";
import { UsersRepository } from "../repositories/UsersRepository"

require('dotenv/config');

interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({ email, password } : IAuthenticateRequest) {
        const usersRepository = getCustomRepository(UsersRepository);

        const user = await usersRepository.findOne({
            email
        });
       
        if(!user) {
            throw new Errors(400,"Email/Password Incorrect!");
        }

        //Compara a senha inserida com a do banco que está criptografada
        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch){
            throw new Errors(400,"Email/Password Incorrect!");
        }

        /*sign vai gerar o token, sendo:
        ---primeiro param -> o payload, infos que quero poder acessar
        ---segundo param -> a chave secreta usada para gerar o token. Bom usar um MD5 Hash Generator para gerar isso
        */
        const token = sign({
            email: user.email
        },process.env.SALT, {
            subject: user.id,
            expiresIn: "1d"
        });

        return token;
    }
}

export { AuthenticateUserService }