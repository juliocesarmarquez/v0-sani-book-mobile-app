import Image from "next/image"

interface SundChainLogoProps {
  size?: number
  className?: string
}

export function SundChainLogo({ size = 32, className = "" }: SundChainLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/images/sundchain-logo.png"
        alt="SundChain Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      <span className="sundchain-brand text-xl bg-gradient-to-r from-sundchain-blue to-sundchain-green bg-clip-text text-transparent">
        SundChain
      </span>
    </div>
  )
}
