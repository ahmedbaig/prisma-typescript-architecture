import express from 'express';
export const viewsRouter = express.Router();

import { Views } from './views.controller';
let views_controller = new Views()
import passport from "../../../middleware/passport";

viewsRouter.get('/', views_controller.index);


// viewsRouter.get('/login', views_controller.login);

// viewsRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// viewsRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), views_controller.social_callback);


// viewsRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

// viewsRouter.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/error' }), views_controller.social_callback);

viewsRouter.get('/*', views_controller.not_found); // Whole world is a 404 - AhmedBaig
