import {Types} from "mongoose";

export type PublisherTypes = {
	_id: Types.ObjectId,
	name: string,
	url: string,
	image: string
}