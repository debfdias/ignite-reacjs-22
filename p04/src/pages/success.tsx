import { stripe } from "@/lib/stripe"
import {
  ImageContainer,
  ImagesContainer,
  SuccessContainer
} from "@/styles/pages/success"
import { GetServerSideProps } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Stripe from "stripe"

interface SuccessProps {
  customerName: string
  product: {
    name: string
    imageUrl: string
  }[]
  productsImages: string[]
}

export default function Success({
  customerName,
  productsImages
}: SuccessProps) {
  return (
    <>
      <Head>
        <title>Order placed | Ignite Shop</title>

        <meta name="robots" content="noindex"></meta>
      </Head>

      <SuccessContainer>
        <ImagesContainer>
          {productsImages.map((image, i) => (
            <ImageContainer key={i}>
              <Image src={image} width={120} height={110} alt="" />
            </ImageContainer>
          ))}
        </ImagesContainer>

        <h1>Order succesfully placed!</h1>

        <p>
          Yay <strong>{customerName}</strong>, your order of{" "}
          {productsImages.length} awesome shirts is on the way to your home.
        </p>

        <Link href="/">Go back to store</Link>
      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product"]
  })

  const customerName = session.customer_details?.name
  const productsImages = session.line_items?.data.map((item) => {
    const product = item.price?.product as Stripe.Product
    return product.images[0]
  })

  return {
    props: {
      customerName,
      productsImages
    }
  }
}
