import express from 'express';
import passport from 'passport';
import { authService } from '../services/auth.service';
import _ from 'lodash';
import { IUser } from '../models/user';


const router = express.Router();


router.get('logout', (req, res) => {
    res.clearCookie('jwt-token');
    res.status(200).send();
});

router.get('/google', passport.authenticate('google', { scope: ['email'] }));


router.get('/google/redirect', passport.authenticate('google'), async (req, res) => {
    const token = await authService.createTokenForUser(req.user as IUser);
    res.cookie('jwt-token', token, { expires: new Date(Date.now() + 86400000) });
    res.status(200).json(_.pick(req.user as IUser, ['id', 'name', 'email']));
});

export default router;