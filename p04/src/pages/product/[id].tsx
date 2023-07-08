import { stripe } from "@/lib/stripe"
import {
  ImageContainer,
  ProductContainer,
  ProductDetails
} from "@/styles/pages/product"
import axios from "axios"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import Stripe from "stripe"

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}
export default function Product({ product }: ProductProps) {
  const [isBuying, setIsBuying] = useState(false)
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Loading...</p>
  }

  async function buyProduct() {
    try {
      setIsBuying(true)
      const response = await axios.post("/api/checkout", {
        priceId: product.defaultPriceId
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (e) {
      setIsBuying(false)
      alert("Something went wrong!")
    }
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>
      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>
        <button disabled={isBuying} onClick={buyProduct}>
          Buy product
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "prod_ODSbpwq50Lyzcl" } }],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productId = String(params!.id)

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"]
  })
  const price = product.default_price as Stripe.Price
  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        description: product.description,
        price: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(price.unit_amount! / 100),
        defaultPriceId: price.id,
        numberPrice: price.unit_amount! / 100
      }
    },
    revalidate: 60 * 60 * 1
  }
}
