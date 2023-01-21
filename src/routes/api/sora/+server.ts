import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const masUrl = new URL('https://eservices.mas.gov.sg/api/action/datastore/search.json');
	masUrl.searchParams.append('resource_id', '9a0bf149-308c-4bd2-832d-76c8e6cb47ed');
	masUrl.searchParams.append('limit', '365');
	masUrl.searchParams.append('sort', 'end_of_day desc');

	const response = await fetch(masUrl);
	const data = await response.json();

	const filteredData = data.result.records
		.filter((record: Record<string, string>) => record.published_date !== null)
		.reverse()
		.map((record: Record<string, string>, index: number, records: Record<string, string>[]) => ({
			comp_sora_3m: record.comp_sora_3m,
			sora: record.sora,
			published_date: record.published_date,
			index
		}));

	return new Response(JSON.stringify({ records: filteredData }));
};
