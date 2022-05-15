import Priority from "@/models/feature-requests/Priority";
import BaseController from "@/controllers/BaseController";

export default class PriorityController extends BaseController<Priority> {
	
	static readonly COLLECTION_PATH = 'priorities'

	constructor() {
		super(Priority, PriorityController.COLLECTION_PATH)
  }
}

