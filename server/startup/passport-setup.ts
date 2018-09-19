import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { User, IUser } from '../models/user';
import config from 'config';

export default function () {

    passport.use(
        new OAuth2Strategy({
            callbackURL: '/auth/google/redirect',
            clientID: config.get('googleOauth.clientId') as string,
            clientSecret: config.get('googleOauth.clientSecret') as string
        }, (accessToken, refreshToken, profile, done) => {

            User.findOne({ googleId: profile.id })
                .then((user) => {
                    if (user) {
                        done(null, user);
                        // maybe detect changes and update the dataset in mongodb, like name, email eg
                    }
                    else {
                        const user = new User({
                            name: profile.displayName,
                            email: profile.emails![0].value,
                            googleId: profile.id
                        }).save()
                            .then((newUser) => {
                                done(null, newUser);
                            })
                            .catch((err) => {
                                done(err, err);
                            });
                    }
                })
                .catch((err) => { done(err, err) })
        })
    );


    passport.serializeUser((user: IUser, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id: string, done) => {
        User.findById(id)
            .then((user) => {
                if (user) done(null, user);
            })
    });


}


