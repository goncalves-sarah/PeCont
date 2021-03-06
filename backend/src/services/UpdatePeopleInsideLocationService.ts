import { getCustomRepository } from "typeorm";
import { CamerasRepository } from "../repositories/CamerasRepository";
import { Errors } from "../errors";
import { LocationsRepository } from "../repositories/LocationsRepository";

interface IUpdateRequest {
    camera_id: string;
    new_amount: number;
}

class UpdatePeopleInsideLocationService {

    async execute({ camera_id, new_amount } : IUpdateRequest) {
        const camerasRepository = getCustomRepository(CamerasRepository);
        const locationsRepository = getCustomRepository(LocationsRepository);

        const camera = await camerasRepository.findOne(camera_id);

        if(!camera) {
            throw new Errors(400,"Camera doesn't exists")
        }

        const location = await locationsRepository.findOne(camera.location)

        let newTotal = +location.total_people_inside + +new_amount

        if(newTotal < 0) {
            newTotal = 0
        }


        await locationsRepository.update(location.id,{
            
            total_people_inside: newTotal
        })

        location.total_people_inside = newTotal

        return location;
    }
}

export { UpdatePeopleInsideLocationService }