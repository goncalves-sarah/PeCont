import { Request, Response} from 'express';
import { ListUserLocationsService } from '../services/ListUserLocationsService';

interface IHeader {
    user_id?: string;
}

class ListUserLocationsController{

    async handle(req: Request, res: Response) {

        const { user_id } = req as IHeader;

        const listUserLocationsService = new ListUserLocationsService();

        const locations = await listUserLocationsService.execute({user_id});

        return res.status(200).json(locations);
    }
}

export { ListUserLocationsController }