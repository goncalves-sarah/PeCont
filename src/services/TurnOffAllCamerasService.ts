import { getCustomRepository } from "typeorm";
import { CamerasRepository } from "../repositories/CamerasRepository";
import { exec } from "child_process"
import { Errors } from "../errors";

interface ICamerasDisconnectRequest {
    user_id : string;
}

class TurnOffAllCamerasService {

    async execute({ user_id } : ICamerasDisconnectRequest) {

        const camerasRepository = getCustomRepository(CamerasRepository);

        const cameras = await camerasRepository.find({
            where: {
                'user' : user_id
            }
        });

       cameras.map(async c => {
            await camerasRepository.update(c.id,{
                status: 0
            })

            try {
            
                process.kill(c.pid,0)
                
                exec("taskkill /F /PID " + c.pid)
            } catch (err) {
                throw new Errors(400,"Process doesn't exists")
            }
       });
    }
}

export { TurnOffAllCamerasService }