import { getCustomRepository } from "typeorm";
import { CamerasRepository } from "../repositories/CamerasRepository";
import { exec } from "child_process"
import { Errors } from "../errors";
import { LocationsRepository } from "../repositories/LocationsRepository";

interface ICamerasDisconnectRequest {
    user_id : string;
}

class TurnOffAllCamerasService {

    async execute({ user_id } : ICamerasDisconnectRequest) {
        
        const camerasRepository = getCustomRepository(CamerasRepository);
        const locationsRepository = getCustomRepository(LocationsRepository);

        const cameras = await camerasRepository.find({
            where: {
                'user' : user_id,
                'status' : 1
            }
        });

       cameras.map(async c => {
            await camerasRepository.update(c.id,{
                status: 0,
                pid: 0
            })
            try {
            
                process.kill(c.pid,0)
                
                exec("taskkill /F /PID " + c.pid)
            } catch (err) {
                throw new Errors(400,"Process doesn't exists")
            }
       });

       const locations = await locationsRepository.find({where: {
           owner: user_id
       }});

       locations.map(async l => {
            await locationsRepository.update(l.id,{
                total_people_inside: 0
        })
       });

    }
}

export { TurnOffAllCamerasService }