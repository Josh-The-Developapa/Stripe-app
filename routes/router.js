const router = require("express").Router();
const stripe = require('stripe')('sk_test_51JJGl0FoXys89NW04r4hH2267S50MXfFvo5fjbpt9r9fLjbF8EhSIQ4zotZimfKiDv3Wch2ckzz5Fr0kKZqHLFq800QGBKCc1k');


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