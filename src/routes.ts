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
import { ListAllUserCamerasController } from './controllers/ListAllUserCamerasController';
import { TurnOffAllCamerasController } from './controllers/TurnOffAllCamerasController';
import { ListLocationByIdController } from './controllers/ListLocationByIdController';
import { UpdateCameraController } from './controllers/UpdateCameraController';
import { ListCameraByIdController } from './controllers/ListCameraByIdController';

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

const listAllUserCamerasController = () => {
    return new ListAllUserCamerasController()
}

const turnOffAllCamerasController = () => {
    return new TurnOffAllCamerasController()
}

const listLocationByIdController = () => {
    return new ListLocationByIdController()
}

const listCameraByIdController = () => {
    return new ListCameraByIdController()
}

const updateCameraController = () => {
    return new UpdateCameraController()
}

router.get("/users/:location_id/cameras", ensureAuthenticated, listLocationCamerasController().handle)
router.get("/users/cameras", ensureAuthenticated, listAllUserCamerasController().handle)
router.get("/users/locations", ensureAuthenticated, listUserLocationsController().handle)
router.get('/locations/:location_id', ensureAuthenticated, listLocationByIdController().handle)
router.get('/cameras/:camera_id', ensureAuthenticated, listCameraByIdController().handle)

router.post("/cameras/connect/:camera_id", ensureAuthenticated, turnCameraOnController().handle)
router.post("/cameras/disconnect", ensureAuthenticated, turnCameraOffController().handle)
router.post("/cameras", ensureAuthenticated, createCameraController().handle);
router.post("/locations/update/total",updatePeopleInsideLocationController().handle)
router.post("/locations", ensureAuthenticated, createLocationController().handle);
router.post("/users/cameras/off", ensureAuthenticated, turnOffAllCamerasController().handle);
router.post("/users", createUserController().handle);
router.post("/login", authenticateUserController().handle);

router.patch("/cameras", ensureAuthenticated, updateCameraController().handle);

router.delete("/cameras/:camera_id", ensureAuthenticated, deleteCameraController().handle)

export { router };