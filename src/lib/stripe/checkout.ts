"use server"
import Stripe from 'stripe'
import { GuestCartItem } from '../cart/guest-cart'
import prisma from '../prisma'
import { CartItemWithProduct } from '../cart/cart.service'
import { redirect } from 'next/navigation'
import { getStripeTaxRateIds } from './tax-rates'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)



export const createAuthenticatedCheckoutSession = async (cartId: string) => {
    const items = await prisma.item.findMany({
        where: { cartId },
        include: { product: true },
    })

    const taxRateIds = await getStripeTaxRateIds(stripe);

    const line_items = items.map((item: CartItemWithProduct) => ({
        price_data: {
            currency: 'cad',
            product_data: {
                name: item.product.name
            },
            unit_amount: Math.round(item.product.price.toNumber() * 100)
        },
        quantity: item.quantity,
        tax_rates: taxRateIds,
    }))

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/cart`,
        metadata: { cartId }
    });

    redirect(session.url!)
}

export const createGuestCheckoutSession = async (items: GuestCartItem[]) => {
    const taxRateIds = await getStripeTaxRateIds(stripe);

    const line_items = items.map((item: GuestCartItem) => ({
        price_data: {
            currency: 'cad',
            product_data: {
                name: item.productName
            },
            unit_amount: Math.round(item.unitPrice * 100)
        },
        quantity: item.quantity,
        tax_rates: taxRateIds,
    }))

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/cart`,
        metadata: { 
            cartId: "GUEST_CHECKOUT",
            items: JSON.stringify(items)
        }
    });

    redirect(session.url!)
}



