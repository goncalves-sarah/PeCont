import { Request, Response} from 'express';
import { ListCameraByIdService } from '../services/ListCameraByIdService';

class ListCameraByIdController{

    async handle(req: Request, res: Response) {
        
        const { camera_id } = req.params;
        
        const listCameraByIdService = new ListCameraByIdService();

        const camera = await listCameraByIdService.execute({ camera_id });

        return res.status(200).json(camera);
    }
}

export { ListCameraByIdController }