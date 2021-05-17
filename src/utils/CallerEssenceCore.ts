import axios from 'axios';
import { stringify } from 'querystring';

export async function getCoreSession(): Promise<string|undefined> {
    return axios({
        url: `${process.env.ESSENCE_CORE_URL}?query=Login`,
        method: 'POST',
        data: {
            cv_token: process.env.ESSENCE_CORE_TOKEN,
        },
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },     
    }).then((res) => res.data.data?.[0].session);
}

export async function getCoreData(query: string, params: Record<string, any> = {}, method: 'POST' | 'GET' = 'POST') {
    let session: string | undefined = '';
    if (process.env.ESSENCE_CORE_TOKEN) {
        session = await getCoreSession();
    }
    return axios({
        url: `${process.env.ESSENCE_CORE_URL}?query=${query}`,
        method,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: stringify({
            session,
            ...params,
        }),
    }).then((res) => res.data.data);
}
