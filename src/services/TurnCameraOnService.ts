import { getCustomRepository } from "typeorm";
import { CamerasRepository } from "../repositories/CamerasRepository";
import { spawn } from "child_process"
import { Errors } from "../errors";

interface ICameraRequest {
    id: string;
}

class TurnCameraOnService {

    async execute({ id } : ICameraRequest) {

        const camerasRepository = getCustomRepository(CamerasRepository);

        const camera = await camerasRepository.findOne(id);
        
        //spawn new child process to call the python script
        try{
            const python = spawn('python', ['src/scripts/contador.py',camera.ip,id],{detached: true});

            await camerasRepository.update(id,{
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