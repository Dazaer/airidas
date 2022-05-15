import Priority from "@/models/Priority";
import BaseController from "./BaseController";

export default class PriorityController extends BaseController<Priority> {
	
	static readonly COLLECTION_PATH = 'priorities'

	constructor(data?: Partial<PriorityController>) {
		super(Priority, PriorityController.COLLECTION_PATH)
		Object.assign(this, data);
  }
}

