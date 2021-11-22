import { getCustomRepository } from "typeorm";
import { spawn } from "child_process"
import { Errors } from "../errors";
import { CamerasRepository } from "../repositories/CamerasRepository";

interface ICameraRequest {
    camera_id: string;
    token : string;
}

class TurnCameraOnService {

    async execute({ camera_id, token } : ICameraRequest) {

        const camerasRepository = getCustomRepository(CamerasRepository);
 
        const camera = await camerasRepository.findOne({id: camera_id});

        try{
            const python = spawn('python', ['src/scripts/contador.py',camera.ip,camera_id,token],{detached: true});

            await camerasRepository.update(camera_id,{
                status: 1,
                pid: python.pid
            });

            camera.status = 1;
            camera.pid = python.pid;

            return camera;

        } catch (e) {
            throw new Errors(500,"Houve um problema no servidor");
        }
    }
}

export { TurnCameraOnService }