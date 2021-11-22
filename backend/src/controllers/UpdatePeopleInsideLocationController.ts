import { Request, Response} from 'express';
import { UpdatePeopleInsideLocationService } from '../services/UpdatePeopleInsideLocationService';

class UpdatePeopleInsideLocationController{

    async handle(req: Request, res: Response) {
        const { camera_id, new_amount } = req.body;
       
        const updatePeopleInsideLocationService = new UpdatePeopleInsideLocationService();

        const location = await updatePeopleInsideLocationService.execute({ camera_id , new_amount });

        return res.json(location);
    }
}

export { UpdatePeopleInsideLocationController }