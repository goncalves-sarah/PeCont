import { Request, Response} from 'express';
import { CreateCameraService } from '../services/CreateCameraService';

interface IHeader {
    user_id?: string;
}

class CreateCameraController{
    async handle(req: Request, res: Response) {
        const { name, status, ip, location_id } = req.body;
        const { user_id } = req as IHeader;
        
        const createCameraService = new CreateCameraService();
        
        const camera = await createCameraService.execute({
            name, 
            location: location_id, 
            status, 
            ip, 
            user : user_id
        });
        

        return res.status(201).json(camera);
    }
}

export { CreateCameraController }
