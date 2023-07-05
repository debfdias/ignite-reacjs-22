import Image from "next/image"
import logoImg from "../../assets/logo.svg"
import { Wrapper } from "./styles"

export function Header() {
  return (
    <Wrapper>
      <Image src={logoImg} alt="" />
    </Wrapper>
  )
}
