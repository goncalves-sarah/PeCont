import { Request, Response} from 'express';
import { TurnCameraOnService } from '../services/TurnCameraOnService';

class TurnCameraOnController{

    async handle(req: Request, res: Response) {
        const { camera_id } = req.params;
        
        const turnCameraOnService = new TurnCameraOnService();

        await turnCameraOnService.execute({
            id : camera_id
        });
        
        return res.status(200).send();
    }
}

export { TurnCameraOnController }
