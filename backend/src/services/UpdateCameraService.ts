import { getCustomRepository } from "typeorm";
import { CamerasRepository } from "../repositories/CamerasRepository";
import { Errors } from "../errors";

interface IUpdateRequest {
    camera_id: string;
    atribute: {
        name?: string;
        location?: string;
        status?: number;
        ip?: string;
        user?: string;
        pid?: number;
        id?: string;
    }
}

class UpdateCameraService {

    async execute({ camera_id, atribute } : IUpdateRequest) {
        const camerasRepository = getCustomRepository(CamerasRepository);
        
        const cam = await camerasRepository.findOne(camera_id);

        if(!cam) {
            throw new Errors(400,"Camera doesn't exists")
        }

        if(atribute.pid != undefined || atribute.id || atribute.user){
            throw new Errors(404,"This parameter cannot be altered")
        }

        await camerasRepository.update(cam.id,atribute);

        Object.assign(cam,atribute)

        return cam;
    }
}

export { UpdateCameraService }