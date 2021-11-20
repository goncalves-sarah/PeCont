import { Request, Response} from 'express';
import { ListLocationByIdService } from '../services/ListLocationByIdService';

class ListLocationByIdController{

    async handle(req: Request, res: Response) {
        
        const { location_id } = req.params;
        console.log(location_id)

        const listLocationByIdService = new ListLocationByIdService();

        const location = await listLocationByIdService.execute({ location_id });

        return res.status(200).json(location);
    }
}

export { ListLocationByIdController }