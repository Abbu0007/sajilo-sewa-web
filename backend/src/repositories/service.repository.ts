import { ServiceModel } from "../models/service.model";

export class ServiceRepository {
  async listActive() {
    return ServiceModel.find({ status: "active" }).sort({ createdAt: -1 }).lean();
  }

  async findById(id: string) {
    return ServiceModel.findById(id).lean();
  }
}
