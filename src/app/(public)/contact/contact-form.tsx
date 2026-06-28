"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Sujet requis"),
  message: z.string().min(10, "Message trop court"),
});

type Form = z.infer<typeof schema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const f = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast.success("Message envoyé ! Nous vous répondrons sous 24h."); f.reset(); }
      else { toast.error("Erreur lors de l'envoi."); }
    } catch { toast.error("Erreur de connexion."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <Card className="max-w-2xl mx-auto"><CardHeader><CardTitle className="text-xl md:text-2xl">Envoyez-nous un message</CardTitle></CardHeader><CardContent>
      <form onSubmit={f.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Votre nom" {...f.register("name")} />
          <Input placeholder="Email" type="email" {...f.register("email")} />
        </div>
        <Input placeholder="Sujet" {...f.register("subject")} />
        <textarea className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-3 h-32 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" placeholder="Votre message" {...f.register("message")} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" />Envoi...</> : <><Send size={16} className="mr-1" />Envoyer</>}
        </Button>
      </form>
    </CardContent></Card>
  );
}
