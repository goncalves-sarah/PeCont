import { Request, Response} from 'express';
import { CreateLocationService } from '../services/CreateLocationService';

interface IHeader {
    user_id?: string;
}

class CreateLocationController{
    async handle(req: Request, res: Response) {
        const { name, total_people_inside, total_capacity } = req.body;
        const { user_id } = req as IHeader;

        const createLocationService = new CreateLocationService();
        
        const location = await createLocationService.execute({
            name, 
            total_people_inside,
            total_capacity,
            owner : user_id
        });
        

        return res.status(201).json(location);
    }
}

export { CreateLocationController }
