import {Types} from "mongoose";
import {ArticleTypes} from "./article";

export type PublisherTypes = {
	_id: Types.ObjectId,
	name: string,
	url: string,
	feed: string,
	country: string,
	image: string,
	articles?: ArticleTypes[]
}