import { getCustomRepository } from "typeorm";
import { Errors } from "../errors";
import { CamerasRepository } from "../repositories/CamerasRepository";
import { LocationsRepository } from "../repositories/LocationsRepository";
import { UsersRepository } from "../repositories/UsersRepository";

interface ICameraRequest {
    name: string;
    location: string;
    status?: Number;
    ip: string;
    user: string;
}

class CreateCameraService {

    async execute({ name, location, status = 0, ip, user } : ICameraRequest) {
        const camerasRepository = getCustomRepository(CamerasRepository);
        const usersRepository = getCustomRepository(UsersRepository);
        const locationsRepository = getCustomRepository(LocationsRepository);

        const cameraAlreadyExists = await camerasRepository.findOne({
            ip
        });

        if(cameraAlreadyExists) {
            throw new Errors(400,"Camera already exists!");
        }

        const isValidUser = await usersRepository.findOne(user);

        if(!isValidUser) {
            throw new Errors(401,"Invalid User!");
        }

        const isValidLocation = await locationsRepository.findOne(location);

        if(!isValidLocation) {
            throw new Errors(402,"Invalid Location!");
        }

        const camera = camerasRepository.create({
            name, 
            location, 
            status, 
            ip, 
            user
        });

        await camerasRepository.save(camera);
        
        return camera;
    }
}

export { CreateCameraService }