import * as request from 'request';
import {stringify} from 'querystring';

const baseRequest = request.defaults({
    headers: {
        'x-requested-with': 'XMLHttpRequest',
    },
    jar: true,
    baseUrl: 'http://portal.theblockheads.net/'
});

/**
 * System generic class for making http requests. Extensions can use through ex.ajax.
 */
export class Ajax {

    /**
     * Function to GET a page. Passes the response of the XHR in the resolve promise.
     *
     * @param url the url to fetch.
     * @param params any parameters to add to the URL in the format of key=value
     * @return the raw page.
     * @example
     * get('/some/url.php', {a: 'test'}).then(console.log)
     * //sends a GET request to /some/url.php?a=test
     */
    static get(url: string = '/', params: {[key: string]: string|number} = {}): Promise<string> {
        url = (url.includes('?') ? url + '&' : url + '?') + stringify(params);

        return new Promise((resolve, reject) => {
            baseRequest.get(url, {}, (err, req, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(body);
            });
        });
    }

    /**
     * Returns a JSON object from the response.
     *
     * @param url the url to fetch.
     * @param params any parameters to add to the URL in the format of key=value
     * @return the result parsed as JSON
     * @example
     * getJSON('/', {id: '123'}).then(console.log);
     */
    static getJSON(url: string = '/', params: {[key: string]: string|number} = {}): Promise<{[key: string]: any}> {
        return Ajax.get(url, params)
            .then(data => {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return {};
                }
            });
    }

    /**
     * Function to make a post request
     * @param url the url to fetch.
     * @param params any parameters to add to the body of the request in the format of key=value
     * @return the raw result.
     * @example
     * post('/', {id: '123'}).then(console.log);
     */
    static post(url: string = '/', params: {[key: string]: string|number} = {}): Promise<string> {
        return new Promise((resolve, reject) => {
            baseRequest.post(url, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: stringify(params),
            }, (err, req, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(body);
            });
        });
    }

    /**
     * Function to fetch JSON from a page through post.
     * @param url the url to fetch.
     * @param params any parameters to add to the body of the request in the format of key=value
     * @return the result parsed as JSON.
     * @example
     * postJSON('/', {id: 'test'}).then(console.log);
     */
    static postJSON(url: string = '/', params: {[key: string]: string|number} = {}): Promise<{[key: string]: any}> {
        return Ajax.post(url, params)
            .then(data => {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return {};
                }
            });
    }
}
