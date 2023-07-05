import { HomeContainer, Product } from "@/styles/pages/home"
import Image from "next/image"

import { KeenSliderPlugin, useKeenSlider } from "keen-slider/react"

import s1 from "../../public/shirt1.png"
import s2 from "../../public/shirt2.png"
import s3 from "../../public/shirt3.png"
import s4 from "../../public/shirt4.png"

import "keen-slider/keen-slider.min.css"

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

export default function Home() {
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
  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      <Product className="keen-slider__slide">
        <Image src={s1} width={520} height={520} alt="" />
        <footer>
          <strong>Shirt 1</strong>
          <span>$ 59,90</span>
        </footer>
      </Product>

      <Product className="keen-slider__slide">
        <Image src={s2} width={520} height={520} alt="" />
        <footer>
          <strong>Shirt 2</strong>
          <span>$ 59,90</span>
        </footer>
      </Product>

      <Product className="keen-slider__slide">
        <Image src={s3} width={520} height={520} alt="" />
        <footer>
          <strong>Shirt 3</strong>
          <span>$ 59,90</span>
        </footer>
      </Product>

      <Product className="keen-slider__slide">
        <Image src={s4} width={520} height={520} alt="" />
        <footer>
          <strong>Shirt 4</strong>
          <span>$ 59,90</span>
        </footer>
      </Product>
    </HomeContainer>
  )
}
