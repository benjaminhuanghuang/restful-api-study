import BaseService from "./BaseService";
import BaseModel from "../models/Carriers";

// CarrierService class is extended from BaseService
// and is initialized with BaseModel
// super key is used to call the constructor of BaseService
// when I give BaseModel to super, it replaces the model in BaseService with BaseModel

class CarrierService extends BaseService {
  constructor() {
    super(BaseModel);
  }
}

export default new CarrierService();
