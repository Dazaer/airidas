import FeatureRequest from "@/models/feature-requests/FeatureRequest"
import BaseController from "@/controllers/BaseController"

export default class FeatureRequestController extends BaseController<FeatureRequest> {

	static readonly COLLECTION_PATH = "feature-requests"

	constructor() {
		super(FeatureRequest, FeatureRequestController.COLLECTION_PATH)
	}

}