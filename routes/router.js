const router = require("express").Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

router.get('/', async (req, res, next) => {
    res.redirect('/checkout')
})

router.get('/failure', async (req, res, next) => {
    res.send('Failure')
})

router.get('/checkout', async (req, res, next) => {
    res.render('checkout')
})

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
    res.render('success')
})



module.exports = router;