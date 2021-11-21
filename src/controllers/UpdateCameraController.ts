import { Request, Response} from 'express';
import { UpdateCameraService } from '../services/UpdateCameraService';

class UpdateCameraController {

    async handle(req: Request, res: Response) {
        const { camera_id, atribute } = req.body;
       
        const updateCameraController = new UpdateCameraService();

        const cam = await updateCameraController.execute({ camera_id , atribute });

        return res.status(200).json(cam);
    }
}

export { UpdateCameraController }