import { Request, Response} from 'express';
import { ListLocationsCamerasService } from '../services/ListLocationCamerasService';

class ListLocationCamerasController{

    async handle(req: Request, res: Response) {

        const { location_id } = req.body;

        const listLocationsCamerasService = new ListLocationsCamerasService();

        const cameras = await listLocationsCamerasService.execute({location_id});

        return res.status(200).json(cameras);
    }
}

export { ListLocationCamerasController }