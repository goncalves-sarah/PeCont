import { getCustomRepository } from "typeorm";
import { Errors } from "../errors";
import { CamerasRepository } from "../repositories/CamerasRepository";

interface ICameraRequest {
    id: string;
}

class DeleteCameraService {

    async execute({ id } : ICameraRequest) {
        const camerasRepository = getCustomRepository(CamerasRepository);

        const camera = await camerasRepository.findOne(id);

        if(camera){
            await camerasRepository.delete(id);
        } else {
            throw new Errors(400,"Câmera não existente!")
        }
    }
}

export { DeleteCameraService }