import { Request, Response} from 'express';
import { TurnOffAllCamerasService } from '../services/TurnOffAllCamerasService';

interface IHeader {
    user_id?: string;
}

class TurnOffAllCamerasController{
   
    async handle(req: Request, res: Response) {
        const { user_id } = req as IHeader;
        
        const turnOffAllCamerasService = new TurnOffAllCamerasService();
        
        await turnOffAllCamerasService.execute({
            user_id
        });

        return res.status(200).send();
    }
}

export { TurnOffAllCamerasController }
