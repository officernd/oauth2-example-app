import * as OAuth2Strategy from 'passport-oauth2';
import { Config } from './config';

const STRATEGY_NAME = 'officernd';
const STRATEGY_OPTIONS = {
    callbackURL: `http://localhost:3000/connect/return`,
    passReqToCallback: true,
    tokenURL: Config.tokenURL,
    authorizationURL: Config.authorizationURL,
    clientID: Config.clientId,
    clientSecret: Config.clientSecret,
    scope: 'officernd.api.read'
};

export class OfficeRnDStrategy extends OAuth2Strategy {
    private name: string;
    constructor(verify) {
        super(STRATEGY_OPTIONS, verify);
        this.name = STRATEGY_NAME;
    }
}
