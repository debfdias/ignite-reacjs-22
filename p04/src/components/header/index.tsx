import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import logoImg from "../../assets/logo.svg"
import { Cart } from "../cart"
import { Wrapper } from "./styles"

export function Header() {
  const { pathname } = useRouter()

  const showCartButton = pathname !== "/success"

  return (
    <Wrapper>
      <Link href="/">
        <Image src={logoImg} alt="" />
      </Link>
      {showCartButton && <Cart />}
    </Wrapper>
  )
}
