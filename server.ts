import * as path from 'path';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as express from 'express';
import * as passport from 'passport';
import { OfficeRnDStrategy } from './officeRnDStrategy';
import { OfficeRnDService } from './officeRnDService';

const app = express();
const cache = {
    connected: false,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    orgSlug: null
};

function updateCache(access_token, refresh_token, expires_in, org_slug) {
    const expiresAt = moment().add(expires_in, 'seconds');

    cache.accessToken = access_token;
    cache.refreshToken = refresh_token;
    cache.expiresAt = expiresAt.format('MMMM Do YYYY, h:mm:ss a');
    cache.connected = expiresAt.isAfter();
    cache.orgSlug = org_slug || cache.orgSlug;
}

function officeRnDLoggedIn(req, access_token, refresh_token, { expires_in }, profile, done) {
    updateCache(access_token, refresh_token, expires_in, req.query.org_slug);

    done(null, {});
}

passport.use(new OfficeRnDStrategy(officeRnDLoggedIn));
app.use(passport.initialize());
app.get('/connect', passport.authorize('officernd'));
app.get('/connect/return', passport.authorize('officernd'), (req, res) => res.sendFile(path.join(__dirname + '/views/authReturn.html')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/views/index.html')));
app.get('/status', (req, res) => {
    res.send(cache);
});
app.get('/refresh', async (req, res) => {
    const service = new OfficeRnDService();
    const { accessToken, refreshToken, expiresIn } = await service.refreshTokens(cache.refreshToken);
    updateCache(accessToken, refreshToken, expiresIn, null);
    res.send();
});
app.get('/members', async (req, res) => {
    const service = new OfficeRnDService();
    const members = await service.getMembers(cache.orgSlug, cache.accessToken);

    res.send(members);
});

app.use(handleError);

app.listen(3000, () => console.log(`Demo oauth app listening on port 3000!`));

function handleError(err, req, res, next) {
    console.log(err);
    res.status(500).send({
        error_message: err.message
    });
}

process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception. Error: ${err}.`, err);
});
