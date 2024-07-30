import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const resp = await fetch(`https://hn.algolia.com/api/v1/search?query=${req.query.term}`);
    const data = await resp.json();
    res.status(200).json(data);
}