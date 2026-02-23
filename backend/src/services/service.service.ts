import { ServiceRepository } from "../repositories/service.repository";

export class ServiceService {
  constructor(private repo: ServiceRepository) {}

  listActive() {
    return this.repo.listActive();
  }
}
