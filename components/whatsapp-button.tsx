"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hola, quiero más información sobre los zapatos.");
    window.open(`https://wa.me/573145389937?text=${message}`, "_blank");
  };

  return (
    <div className="flex justify-center py-4 sm:py-8 px-2">
      <Button
        onClick={handleWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-lg animate-pulse hover:animate-none transition-all duration-300 text-sm sm:text-base"
      >
        <MessageCircle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Habla con nosotros por </span>
        Ofertas en nuestro grupo de WhatsApp
      </Button>
    </div>
  );
}