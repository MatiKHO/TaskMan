const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();


router.post('/register', async (req, res) => {
    const  { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        req.flash('success_msg', 'Usuario creado exitosamente. Ahora puedes iniciar sesión.');
        res.redirect('/api/login');

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error al registrar el usuario');
        res.redirect('/api/register');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/home',
    failureRedirect: '/api/login',
    failureFlash: true,
}));

router.get('/home', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'No autorizado');
        return res.redirect('/api/login');
    }

    res.render('dashboard', { user: req.user, layout: 'main' });
});

router.get('/logout', (req, res) => {
    req.logout((error) => {
        if (error) {req.flash('error_msg', 'Error al cerrar sesión');
        return res.redirect('/api/home');
    }
    req.flash('success_msg', 'Sesión cerrada exitosamente');
    res.redirect('/api/login');
    });
});

module.exports = router;