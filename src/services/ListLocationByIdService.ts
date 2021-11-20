import { classToPlain } from "class-transformer";
import { getCustomRepository } from "typeorm"
import { LocationsRepository } from "../repositories/LocationsRepository"

interface IUserRequest {
    location_id : string;
}

class ListLocationByIdService {

    async execute({ location_id } : IUserRequest) {

        const locationsRepository = getCustomRepository(LocationsRepository);
 
        const location = await locationsRepository.findOne({
            where: {
                id: location_id
            }
        });
        console.log(location)
        //classToPlain é usado para criar novos objetos se baseando nos antigos, mas com os novos atribs do class-transformer inseridos dentro da entity
        return classToPlain(location); 
    }
       
}

export { ListLocationByIdService }