import { Request, Response} from 'express';
import { TurnCameraOffService } from '../services/TurnCameraOffService';

class TurnCameraOffController{
   
    async handle(req: Request, res: Response) {
        const { camera_id, pid } = req.body;
        
        const turnCameraOffService = new TurnCameraOffService();
        
        await turnCameraOffService.execute({
            id : camera_id,
            pid
        });

        return res.status(200).send();
    }
}

export { TurnCameraOffController }
