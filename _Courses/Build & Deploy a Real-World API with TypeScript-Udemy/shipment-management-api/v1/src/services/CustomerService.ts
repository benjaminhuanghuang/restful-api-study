import BaseService from "./BaseService";
import BaseModel from "../models/Customers";

class CustomerService extends BaseService {
  constructor() {
    super(BaseModel);
  }
}

export default new CustomerService();
