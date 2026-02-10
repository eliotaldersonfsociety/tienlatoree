import Image from "next/image"

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="La Torre Imperial"
      width={32}
      height={32}
      className="rounded-full"
    />
  )
}
