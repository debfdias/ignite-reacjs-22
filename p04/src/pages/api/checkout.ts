// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IProduct } from "@/contexts/CartContext"
import { stripe } from "@/lib/stripe"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { products } = req.body as { products: IProduct[] }

  if (!products) {
    return res.status(400).json({ error: "Products not found." })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_URL}`,
    mode: "payment",
    line_items: products.map((product) => ({
      price: product.defaultPriceId,
      quantity: 1
    }))
  })

  return res.status(201).json({ checkoutUrl: checkoutSession.url })
}
