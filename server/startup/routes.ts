import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import passport from 'passport';
import auth from '../routes/auth';
import error from '../services/error';
import { jwtClaimSetMiddleware, authMiddleware } from '../services/auth.service';


export default function (app: express.Application) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(helmet());
    app.use(passport.initialize());
    app.use(jwtClaimSetMiddleware);


    app.use('/auth', auth);
    app.use(error);
}