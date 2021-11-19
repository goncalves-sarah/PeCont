import { getCustomRepository } from "typeorm";
import { Errors } from "../errors";
import { LocationsRepository } from "../repositories/LocationsRepository";
import { UsersRepository } from "../repositories/UsersRepository";

interface ILocationRequest {
    name: string;
    total_people_inside?: number;
    owner: string;
}

class CreateLocationService {

    async execute({ name, total_people_inside = 0, owner } : ILocationRequest) {

        const usersRepository = getCustomRepository(UsersRepository);
        const locationsRepository = getCustomRepository(LocationsRepository);

        const locationAlreadyExists = await locationsRepository.findOne({
            name
        });

        if(locationAlreadyExists) {
            throw new Errors(400,"Location already exists!");
        }
        
        const isValidUser = await usersRepository.findOne(owner);

        if(!isValidUser) {
            throw new Errors(401,"Invalid User!");
        }
       
        const location = locationsRepository.create({
            name, 
            total_people_inside,
            owner
        });

        await locationsRepository.save(location);
        
        return location;
    }
}

export { CreateLocationService }