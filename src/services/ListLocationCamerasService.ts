import { classToPlain } from "class-transformer";
import { getCustomRepository } from "typeorm"
import { CamerasRepository } from "../repositories/CamerasRepository";

interface IUserRequest {
    location_id: string;
}

class ListLocationsCamerasService {

    async execute({ location_id } : IUserRequest) {

        const camerasRepository = getCustomRepository(CamerasRepository);
 
        const cameras = await camerasRepository.find({
            where: {
                location: location_id
            }
        });
            
        //classToPlain é usado para criar novos objetos se baseando nos antigos, mas com os novos atribs do class-transformer inseridos dentro da entity
        return classToPlain(cameras); 
    }
       
}

export { ListLocationsCamerasService }