import { Request, Response} from 'express';
import { DeleteUserService } from '../services/DeleteUserService';

class DeleteUserController{
    async handle(req: Request, res: Response) {
        const { user_id } = req;

        const deleteUserService = new DeleteUserService();
        
        await deleteUserService.execute({
            id: user_id
        });

        return res.status(204).send();
    }
}

export { DeleteUserController }
