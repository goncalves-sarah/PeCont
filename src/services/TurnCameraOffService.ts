import { getCustomRepository } from "typeorm";
import { CamerasRepository } from "../repositories/CamerasRepository";
import { exec } from "child_process"
import { Errors } from "../errors";


interface ICameraDisconnectRequest {
    id : string;
    pid: number;
}

class TurnCameraOffService {

    async execute({ id, pid } : ICameraDisconnectRequest) {

        const camerasRepository = getCustomRepository(CamerasRepository);

        await camerasRepository.update(id,{
            status: 0
        })
        
        try {
            
            process.kill(pid,0)
            
            exec("taskkill /F /PID " + pid)
        } catch (err) {
            throw new Errors(400,"Process doesn't exists")
        }
    
    }
}

export { TurnCameraOffService }