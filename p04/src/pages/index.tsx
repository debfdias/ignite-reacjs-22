import { stripe } from "@/lib/stripe"
import { HomeContainer, Product } from "@/styles/pages/home"
import { KeenSliderPlugin, useKeenSlider } from "keen-slider/react"
import { GetStaticProps } from "next"
import Image from "next/image"

import "keen-slider/keen-slider.min.css"

import { AddProduct } from "@/components/addProduct"
import { IProduct } from "@/contexts/CartContext"
import { useCart } from "@/hooks/userCart"
import Link from "next/link"
import { MouseEvent } from "react"
import Stripe from "stripe"

interface HomeProps {
  products: IProduct[]
}

const WheelControls: KeenSliderPlugin = (slider) => {
  let touchTimeout: ReturnType<typeof setTimeout>
  let position: {
    x: number
    y: number
  }
  let wheelActive: boolean

  function dispatch(e: WheelEvent, name: string) {
    position.x -= e.deltaX
    position.y -= e.deltaY
    slider.container.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          x: position.x,
          y: position.y
        }
      })
    )
  }

  function wheelStart(e: WheelEvent) {
    position = {
      x: e.pageX,
      y: e.pageY
    }
    dispatch(e, "ksDragStart")
  }

  function wheel(e: WheelEvent) {
    dispatch(e, "ksDrag")
  }

  function wheelEnd(e: WheelEvent) {
    dispatch(e, "ksDragEnd")
  }

  function eventWheel(e: WheelEvent) {
    e.preventDefault()
    if (!wheelActive) {
      wheelStart(e)
      wheelActive = true
    }
    wheel(e)
    clearTimeout(touchTimeout)
    touchTimeout = setTimeout(() => {
      wheelActive = false
      wheelEnd(e)
    }, 50)
  }

  slider.on("created", () => {
    slider.container.addEventListener("wheel", eventWheel, {
      passive: false
    })
  })
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: false,
      rubberband: false,
      slides: {
        perView: 3,
        spacing: 48
      }
    },
    [WheelControls]
  )

  const { addToCart, checkIfItemAlreadyExists } = useCart()

  function handleAddToCart(
    e: MouseEvent<HTMLButtonElement>,
    product: IProduct
  ) {
    e.preventDefault()
    addToCart(product)
  }

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => {
        return (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Product className="keen-slider__slide">
              <Image src={product.imageUrl} width={520} height={520} alt="" />
              <footer>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </div>
                <AddProduct
                  size="large"
                  color="green"
                  disabled={checkIfItemAlreadyExists(product.id)}
                  onClick={(e) => handleAddToCart(e, product)}
                />
              </footer>
            </Product>
          </Link>
        )
      })}
    </HomeContainer>
  )
}

export const getServerSideProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"]
  })
  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(price.unit_amount! / 100),
      defaultPriceId: price.id,
      numberPrice: price.unit_amount! / 100
    }
  })
  return {
    props: {
      products
    }
  }
}
