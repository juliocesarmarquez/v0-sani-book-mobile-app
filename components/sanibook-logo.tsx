import Image from "next/image"

interface SaniBookLogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function SaniBookLogo({ size = 32, className = "", showText = true }: SaniBookLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/images/sanibook-logo.png"
        alt="SaniBook Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      {showText && (
        <span className="sundchain-brand text-xl bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
          SaniBook
        </span>
      )}
    </div>
  )
}
