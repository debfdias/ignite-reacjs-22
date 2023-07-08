import { useCart } from "@/hooks/userCart"
import * as Dialog from "@radix-ui/react-dialog"
import axios from "axios"
import Image from "next/image"
import { ShoppingCart, X } from "phosphor-react"
import { useState } from "react"
import {
  CartButtonContainer,
  CartClose,
  CartContent,
  CartFinalization,
  CartProduct,
  CartProductDetails,
  CartProductImage,
  DetailsFinalization
} from "./styles"

export function Cart() {
  const { cartItems, removeCartItem, cartTotal } = useCart()
  const cartQuantity = cartItems ? cartItems?.length : 0

  const formattedCartTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cartTotal)

  const [isBuying, setisBuying] = useState(false)

  async function handleCheckout() {
    try {
      setisBuying(true)

      const response = await axios.post("/api/checkout", {
        products: cartItems
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (err) {
      setisBuying(false)
      alert("Something went wrong!")
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <CartButtonContainer>
          {cartQuantity > 0 && <span>{cartQuantity}</span>}
          <ShoppingCart weight="bold" />
        </CartButtonContainer>
      </Dialog.Trigger>
      <Dialog.Portal>
        <CartContent>
          <CartClose>
            <X size={24} weight="bold" />
          </CartClose>
          <h2>Cart</h2>

          <section>
            {cartItems.length <= 0 && <p>Your cart is empty!</p>}
            {cartItems.map((cartItem) => (
              <CartProduct key={cartItem.id}>
                <CartProductImage>
                  <Image
                    width={100}
                    height={93}
                    alt=""
                    src={cartItem.imageUrl}
                  />
                </CartProductImage>
                <CartProductDetails>
                  <p>{cartItem.name}</p>
                  <strong>{cartItem.price}</strong>
                  <button onClick={() => removeCartItem(cartItem.id)}>
                    Remove
                  </button>
                </CartProductDetails>
              </CartProduct>
            ))}
          </section>

          <CartFinalization>
            <DetailsFinalization>
              <div>
                <span>Amount</span>
                <p>
                  {cartQuantity} {cartQuantity > 1 ? "itens" : "item"}
                </p>
              </div>
              <div>
                <span>Total value</span>
                <p>{formattedCartTotal}</p>
              </div>
            </DetailsFinalization>
            <button
              onClick={handleCheckout}
              disabled={isBuying || cartQuantity <= 0}
            >
              Place order
            </button>
          </CartFinalization>
        </CartContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
