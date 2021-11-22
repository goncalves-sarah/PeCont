import { Request, Response} from 'express';
import { TurnCameraOnService } from '../services/TurnCameraOnService';

class TurnCameraOnController{

    async handle(req: Request, res: Response) {
        const { camera_id } = req.params;
        
        const turnCameraOnService = new TurnCameraOnService();

        const camera = await turnCameraOnService.execute({
            camera_id,
            token : req.headers.authorization
        });
        
        return res.status(200).json(camera);
    }
}

export { TurnCameraOnController }
