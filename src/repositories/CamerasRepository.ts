import { EntityRepository, Repository } from "typeorm";
import { Camera } from "../entities/Camera";

@EntityRepository(Camera)
class CamerasRepository extends Repository<Camera>{}

export { CamerasRepository }