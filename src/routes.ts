import { Router } from 'express';

import { CreateCameraController } from './controllers/CreateCameraController';
import { CreateUserController } from './controllers/CreateUserController';
import { TurnCameraOnController } from './controllers/TurnCameraOnController';
import { TurnCameraOffController } from './controllers/TurnCameraOffController';
import { DeleteCameraController } from './controllers/DeleteCameraController';
import { CreateLocationController } from './controllers/CreateLocationController';
import { UpdatePeopleInsideLocationController } from './controllers/UpdatePeopleInsideLocationController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { ListUserLocationsController } from './controllers/ListUserLocationsController';
import { ListLocationCamerasController } from './controllers/ListLocationCamerasController';

const router = Router();

const createCameraController = () => {
    return new CreateCameraController()
}

const createUserController = () => {
    return new CreateUserController()
}

const createLocationController = () => {
    return new CreateLocationController()
}

const turnCameraOnController = () => {
    return new TurnCameraOnController()
}

const turnCameraOffController = () => {
    return new TurnCameraOffController()
}

const deleteCameraController = () => {
    return new DeleteCameraController()
}

const updatePeopleInsideLocationController = () => {
    return new UpdatePeopleInsideLocationController()
}

const authenticateUserController = () => {
    return new AuthenticateUserController()
}

const listUserLocationsController = () => {
    return new ListUserLocationsController()
}

const listLocationCamerasController = () => {
    return new ListLocationCamerasController()
}

router.get("/cameras/connect/:camera_id", ensureAuthenticated, turnCameraOnController().handle)
router.get("/cameras/disconnect", ensureAuthenticated, turnCameraOffController().handle)
router.get("/users/locations/cameras", ensureAuthenticated, listLocationCamerasController().handle)
router.get("/users/locations", ensureAuthenticated, listUserLocationsController().handle)

router.post("/cameras", ensureAuthenticated, createCameraController().handle);
router.post("/locations/update/total",updatePeopleInsideLocationController().handle)
router.post("/locations", ensureAuthenticated, createLocationController().handle);
router.post("/users", createUserController().handle);
router.post("/login", authenticateUserController().handle);

router.delete("/cameras/:camera_id", ensureAuthenticated, deleteCameraController().handle)

export { router };