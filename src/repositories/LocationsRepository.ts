import { EntityRepository, Repository } from "typeorm";
import { Location } from "../entities/Location";

@EntityRepository(Location)
class LocationsRepository extends Repository<Location>{}

export { LocationsRepository }