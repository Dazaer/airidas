import Priority from "@/models/Priority";
import BaseController from "../BaseController";

export default class PriorityController extends BaseController<Priority> {
	
	static readonly COLLECTION_PATH = 'priorities'

	constructor() {
		super(Priority, PriorityController.COLLECTION_PATH)
  }
}

