import { Request, Response} from 'express';
import { DeleteCameraService } from '../services/DeleteCameraService';

class DeleteCameraController{
    async handle(req: Request, res: Response) {
        const { camera_id } = req.params;
        
        const deleteCameraService = new DeleteCameraService();
        
        await deleteCameraService.execute({
            id: camera_id
        });

        return res.status(200).json({
            "message": "Câmera Deletada com Sucesso!"
        });
    }
}

export { DeleteCameraController }
