import { classToPlain } from "class-transformer";
import { getCustomRepository } from "typeorm"
import { LocationsRepository } from "../repositories/LocationsRepository"

interface IUserRequest {
    user_id: string;
}

class ListUserLocationsService {

    async execute({ user_id } : IUserRequest) {

        const locationsRepository = getCustomRepository(LocationsRepository);
 
        const locations = await locationsRepository.find({
            where: {
                owner: user_id
            }
        });
            
        //classToPlain é usado para criar novos objetos se baseando nos antigos, mas com os novos atribs do class-transformer inseridos dentro da entity
        return classToPlain(locations); 
    }
       
}

export { ListUserLocationsService }