import { ShoppingCart } from "phosphor-react"
import { ComponentProps } from "react"
import { CartButtonContainer } from "./styles"

type CartButtonProps = ComponentProps<typeof CartButtonContainer> & {
  quantity?: number
}

export function AddProduct({ quantity = 0, ...rest }: CartButtonProps) {
  return (
    <CartButtonContainer {...rest}>
      {quantity > 0 && <span>{quantity}</span>}
      <ShoppingCart weight="bold" />
    </CartButtonContainer>
  )
}
