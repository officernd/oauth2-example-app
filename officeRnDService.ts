import * as _ from 'lodash';
import * as querystring from 'querystring';
import * as request from 'request';
import { Config } from './config';

export class OfficeRnDService {

    private promisifyRequest(options) {
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
                    const result = (body && _.isString(body)) ? JSON.parse(body) : body;
                    resolve(result || {});
                } else {
                    reject({
                        http_status: response.statusCode,
                        message: body
                    });
                }
            });
        });
    }

    public async refreshTokens(refreshToken) {
        const uri = Config.tokenURL;
        const form = querystring.stringify({
            client_id: Config.clientId,
            client_secret: Config.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        });
        const result: any = await this.promisifyRequest({
            uri,
            method: 'POST',
            body: form,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': form.length
            }
        });

        return {
            accessToken: result.access_token,
            refreshToken: result.refresh_token,
            expiresIn: result.expires_in
        };
    }

    public async getMembers(orgSlug, accessToken) {
        const uri = `${Config.apiRootUrl}/${orgSlug}/members`;
        const result = await this.promisifyRequest({
            headers: { 'Authorization': `Bearer ${accessToken}` },
            uri,
            method: 'GET'
        });

        return _(result).map(r => ({ name: r.name, email: r.email }));
    }
}