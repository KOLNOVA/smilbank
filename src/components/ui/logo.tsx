import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  inverse?: boolean;
}

export function Logo({ size = "md", className = "", inverse = false }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 44, text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2 flex-shrink-0 ${className}`}>
      <div
        className="relative rounded-lg overflow-hidden flex items-center justify-center"
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src="/logo.png"
          alt="SmilBank"
          width={s.icon}
          height={s.icon}
          className="object-cover"
          priority
        />
      </div>
      <span className={`font-heading font-bold ${s.text} ${inverse ? "text-white" : "text-gray-900"}`}>
        Smil<span className={`${inverse ? "text-blue-300" : "text-primary-700"}`}>Bank</span>
      </span>
    </Link>
  );
}
