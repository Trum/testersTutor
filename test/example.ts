import {TestAPIServer} from "../tools/TestAPIServer";

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const should = chai.should();

describe('admin#Arrangement', () => {

    let server: TestAPIServer;

    const email = "em@il.com";
    const pwd = "success";

    //some empty usid
    const userKey = 'rndKey';

    before(async () => {
        server = new TestAPIServer();
        await server.start();
    });

    beforeEach(async () => {

    });

    it('should be able login with current auth data', async () => {
        const loginBody = {
            email: email,
            password: pwd
        };

        const result = await server.user(userKey).post('/login', loginBody);
        result.statusCode.should.be.equal(201);
    });

    it('should be unavailable to login with incorrect auth data', async () => {
        const loginBody = {
            email: email,
            password: '123qwe'
        };

        const result = await server.user(userKey).post('/login', loginBody);
        result.statusCode.should.be.equal(404);
    });


    afterEach(done => {
        done()
    });

    after(done => {
        server.stop();
        done()
    });
});