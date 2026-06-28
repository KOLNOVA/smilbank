"use client";
import { useAuth } from "@/context/auth-context";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/connexion");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
