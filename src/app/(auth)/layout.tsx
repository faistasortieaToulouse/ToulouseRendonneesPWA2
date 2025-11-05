// Suppression des imports Next.js spécifiques
// import Image from "next/image";
// import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/tolosaamicalstudio.firebasestorage.app/o/toulouserando%2Flogo_Toulouse_Rando.jpg?alt=media&token=756b580e-fd44-46b4-8a13-56a7c8f75aaa";
  
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        {/* Remplacement de <Link> par <a> */}
        <a href="/" className="flex items-center gap-3 text-foreground">
          {/* Remplacement de <Image> par <img> */}
          <img 
            src={logoUrl} 
            alt="Toulouse rando Logo" 
            width={50} 
            height={50} 
            className="rounded-md" 
          />
          <span className="text-xl font-bold">Toulouse rando</span>
        </a>
      </div>
      {children}
    </main>
  );
}
