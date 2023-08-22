/**
 * All and subsequent scrappers
 */
import axios from 'axios';
import * as cheerio from 'cheerio';

export class Indeed {
	async scrape(locations: string[], page: number) {
		locations.map(async (location) => {
			const response = await axios.get(`https://ng.indeed.com/jobs?q=&l=${location}`);
			const html = response.data;
			const $ = cheerio.load(html);
			const jobs = $('#mosaic-provider-jobcards li');

			// "selectors": {
			// 	"jobItem": "#mosaic-provider-jobcards li",
			// 		"jobItemTitle": ".jobTitle a",
			// 		"jobItemLink": ".jobTitle a['href']",
			// 		"jobItemEmployer": ".companyName",
			// 		"jobLocation": ".companyLocation",
			// 		"jobAttributes": ".metadata .attribute_snippet"
			// }

			jobs.each((n, job) => {
				$(job).find(".jobTitle a").text();
			})
		});
	}
}