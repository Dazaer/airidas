import FeatureRequest from "@/models/feature-requests/FeatureRequest"
import BaseController from "@/controllers/BaseController"

export default class FeatureRequestController extends BaseController<FeatureRequest> {

	static readonly COLLECTION_PATH = "feature-requests"
	private _withPriority = false

	constructor() {
		super(FeatureRequest, FeatureRequestController.COLLECTION_PATH)
	}

	includePriority(): FeatureRequestController {
		this._withPriority = true
		return this
	}

	async get(id: string): Promise<FeatureRequest> {
		const model = await super.get(id)

		if (this._withPriority) {
			model.populateNestedProperties(this._withPriority)
		}

		return model
	}

	async getAll(): Promise<FeatureRequest[]> {
		const models = await super.getAll()

		models.map(model => {
			if (this._withPriority) {
				model = model.populateNestedProperties(this._withPriority)
			}

			return model
		})

		return models
	}

}