const router = require("express").Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const express = require('express');
let payload;

router.get('/', async (req, res, next) => {
    res.redirect('/checkout')
})

router.get('/failure', async (req, res, next) => {
    res.send('Failure')
})

router.get('/checkout', async (req, res, next) => {
    res.render('checkout')
})

router.post('/webhook', express.json({ type: 'application/json' }), (req, res) => {
    payload = req.body;

    console.log("Got payload: " + payload.type);

    res.status(200);
});

router.post('/create-checkout-session', async (req, res, next) => {
    const { currency, name, amount, quantity } = req.body;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: name,
                    },
                    unit_amount: `${ amount }00`,
                },
                quantity: quantity,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:5000/success',
        cancel_url: 'http://localhost:5000/failure',
    });
    res.redirect(303, session.url);
})

router.get('/success', async (req, res, next) => {
    if (!payload) {
        res.send('Payment not done properly, you naughte naughte')
        return
    }

    if (payload.type == 'checkout.session.completed') {
        res.render('success');
    } else {
        res.send('Payment incomplete, you naughteee naughteee')
    }
})

router.get('*', async (req, res, next) => {
    res.send("404 not found")
})



module.exports = router;