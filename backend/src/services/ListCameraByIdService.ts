import { classToPlain } from "class-transformer";
import { getCustomRepository } from "typeorm"
import { CamerasRepository } from "../repositories/CamerasRepository";

interface IUserRequest {
    camera_id : string;
}

class ListCameraByIdService {

    async execute({ camera_id } : IUserRequest) {

        const camerasRepository = getCustomRepository(CamerasRepository);
 
        const camera = await camerasRepository.findOne({
            where: {
                id: camera_id
            }
        });
        
        //classToPlain é usado para criar novos objetos se baseando nos antigos, mas com os novos atribs do class-transformer inseridos dentro da entity
        return classToPlain(camera); 
    }
       
}

export { ListCameraByIdService }