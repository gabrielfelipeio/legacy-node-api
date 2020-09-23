const passport = require("passport");
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");

// DatabaseOperations
const UsersDatabaseOperations = require("../app/databaseOperations/Users")();

let { ExtractJwt, Strategy } = passportJWT;
let jwtOptions  = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'mySecretKe'
};

module.exports = {
    get auth(){
        let strategy = new Strategy(jwtOptions, async (jwt_payload, next) => {
                const user = await UsersDatabaseOperations.findById(jwt_payload._id);
                (user) ? next(null, user) : next(null, false);
        });
        passport.use(strategy);
        return {
            initialize: () => passport.initialize(),
            get authenticate(){ return passport.authenticate('jwt', { session: false }) }
        }
    },
    login: async (email, password, callback) => {
        const user = await UsersDatabaseOperations.findByEmailAndPassword(email, password);
        if(user){
            let payload = {_id: user._id};
            let token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: '1h'});
            callback({auth: true, token});
        }else {
            callback({auth: false});
        }
    }
};