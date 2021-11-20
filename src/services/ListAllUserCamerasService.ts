import { classToPlain } from "class-transformer";
import { getCustomRepository } from "typeorm"
import { CamerasRepository } from "../repositories/CamerasRepository";

interface IUserRequest {
    user_id: string;
}

class ListAllUserCamerasService {

    async execute({ user_id } : IUserRequest) {
        
        const camerasRepository = getCustomRepository(CamerasRepository);
 
        const cameras = await camerasRepository.find({
            where: {
                user: user_id
            }
        });
            
        //classToPlain é usado para criar novos objetos se baseando nos antigos, mas com os novos atribs do class-transformer inseridos dentro da entity
        return classToPlain(cameras); 
    }
       
}

export { ListAllUserCamerasService }