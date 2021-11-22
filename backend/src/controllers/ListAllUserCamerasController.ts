import { Request, Response} from 'express';
import { ListAllUserCamerasService } from '../services/ListAllUserCamerasService';

interface IHeader {
    user_id?: string;
}

class ListAllUserCamerasController{

    async handle(req: Request, res: Response) {

        const { user_id } = req as IHeader;
    
        const listAllUserCamerasController = new ListAllUserCamerasService();

        const cameras = await listAllUserCamerasController.execute({ user_id });

        return res.status(200).json(cameras);
    }
}

export { ListAllUserCamerasController }