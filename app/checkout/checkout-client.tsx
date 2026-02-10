"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { completeOrderAction } from "@/lib/actions/orders";
import { cartStorage, CartItem } from "@/lib/store";
import { useConversionScore } from "@/hooks/useConversionScore";
import { ArrowLeft, Trash2, Plus, Minus, Check, Lock, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutClientProps {
  isLoggedIn: boolean;
}

export default function CheckoutClient({ isLoggedIn }: CheckoutClientProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const score = useConversionScore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [authMethod, setAuthMethod] = useState<"login" | "guest" | null>(isLoggedIn ? "guest" : null); // data from user if logged in
  
  // Form States
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [country, setCountry] = useState<string>("Colombia");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "cash_on_delivery">("transfer");
  const [openPaymentMethods, setOpenPaymentMethods] = useState<string[]>([]);

  // Manejar cambio de método de pago
  const handlePaymentMethodChange = (value: "transfer" | "cash_on_delivery") => {
    setPaymentMethod(value);
    // Abrir automáticamente todos los métodos cuando se selecciona transferencia
    if (value === "transfer") {
      setOpenPaymentMethods(["nequi", "bancolombia", "bbva", "daviplata", "westernunion"]);
    } else {
      setOpenPaymentMethods([]);
    }
  };

  useEffect(() => {
    setTheme("dark");
    setCartItems(cartStorage.get());
  }, [setTheme]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    const updated = cartStorage.updateQuantity(id, newQty);
    setCartItems(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartStorage.remove(id);
    setCartItems(updated);
    // Refresh to ensure state sync, though updateQuantity/remove usually return new cart
  };

  const handleCompleteOrder = async () => {
    if (paymentMethod === "transfer" && !paymentProof) {
        setError("Por favor sube el comprobante de pago.");
        return;
    }

    // Validar email si no está logueado
    if (!isLoggedIn && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      setError("Por favor ingresa un email válido.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("phone", phone);
      formData.append("country", country);
      formData.append("cardNumber", cardNumber);
      formData.append("additionalInfo", additionalInfo);
      formData.append("paymentMethod", paymentMethod);
      formData.append("total", total.toString());
      formData.append("items", JSON.stringify(cartItems));
      if (paymentProof) formData.append("file", paymentProof);

      const result = await completeOrderAction(formData);
      if (!result.success) {
        setError(result.error!);
        return;
      }

      cartStorage.clear();
      router.push(`/success?orderId=${result.orderId}`);
    } catch (err: any) {
      setError(err.message || "Error al completar el pedido");
    } finally {
      setUploading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const discountedPrice = (() => {
        if (item.quantity === 2) return item.price * 0.95;
        if (item.quantity === 3) return item.price * 0.92;
        if (item.quantity === 4) return item.price * 0.9;
        return item.price;
      })();
      return sum + discountedPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="font-medium">Volver</span>
            </Link>
            <h1 className="text-2xl font-bold ml-auto md:ml-0 md:flex-1 text-center md:text-left">Finalizar Compra</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Cart & Summary */}
            <div className="space-y-6 lg:order-1 order-2">
                <div>
                     <h2 className="text-xl font-bold mb-4">Tu Carrito</h2>
                     <div className="space-y-4">
                         {cartItems.length === 0 ? (
                              <div className="bg-[#111] border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
                                 <p>Tu carrito está vacío.</p>
                                 <Link href="/" className="text-green-500 hover:underline mt-2 inline-block">Ir a comprar</Link>
                              </div>
                         ) : (
                             cartItems.map((item) => (
                                 <div key={item.id} className="bg-[#111] border border-zinc-800 rounded-xl p-4 flex gap-4 items-center animate-in fade-in slide-in-from-bottom-2">
                                     <div className="relative w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <h3 className="font-semibold text-sm md:text-base truncate pr-2">{item.name}</h3>
                                         <p className="text-xs text-zinc-500 truncate">{item.category || "Producto Digital"}</p>
                                         <div className="text-green-500 font-bold mt-1 text-sm md:text-base">
                                             {formatPrice(item.price * item.quantity)}
                                         </div>
                                     </div>
                                     <div className="flex flex-col items-end gap-2">
                                         <button 
                                             onClick={() => removeItem(item.id)}
                                             className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                                             aria-label="Eliminar"
                                         >
                                             <Trash2 size={16} />
                                         </button>
                                         <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                                             <button 
                                                 onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                 className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                                             >
                                                 <Minus size={14} />
                                             </button>
                                             <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                             <button 
                                                 onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                 className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                                             >
                                                 <Plus size={14} />
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             ))
                         )}
                      </div>
                </div>

                {/* Totals */}
                <div className="bg-[#111] border border-zinc-800 rounded-xl p-6 space-y-3 sticky top-4">
                    <div className="flex justify-between text-zinc-400">
                        <span>Subtotal mensual:</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-3 border-t border-zinc-800">
                        <span>Total a pagar:</span>
                        <span className="text-green-500">{formatPrice(total)}</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Auth & Payment */}
            <div className="space-y-6 lg:order-2 order-1">
                <h2 className="text-xl font-bold mb-4">Información de Pago</h2>
                
                <div className="bg-[#111] border border-zinc-800 rounded-xl p-6">
                    <h3 className="font-bold text-center mb-1 text-lg">Identificación</h3>
                    <p className="text-center text-zinc-500 text-sm mb-6">Para continuar con tu compra, selecciona una opción:</p>

                    {!isLoggedIn ? (
                        <div className="space-y-4">
                            {/* Login Option */}
                            <div 
                                onClick={() => setAuthMethod("login")}
                                className={cn(
                                    "border rounded-lg p-4 cursor-pointer transition-all duration-200",
                                    authMethod === "login" ? "border-green-500/50 bg-zinc-900/80 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "border-zinc-800 hover:border-zinc-700 bg-[#111]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                        authMethod === "login" ? "border-green-500 bg-green-500 text-black" : "border-zinc-600"
                                    )}>
                                        {authMethod === "login" && <Check size={12} strokeWidth={3} />}
                                    </div>
                                    <span className={cn("font-medium", authMethod === "login" ? "text-white" : "text-zinc-300")}>Ya soy cliente (Iniciar Sesión)</span>
                                </div>
                                {authMethod === "login" && (
                                    <div className="mt-4 pl-8 animate-in fade-in slide-in-from-top-1">
                                        <p className="text-sm text-zinc-400 mb-3">Inicia sesión para usar tus datos guardados.</p>
                                        <Button asChild className="w-full bg-white text-black hover:bg-zinc-200">
                                            <a href="/login?redirect=/checkout">Ir a Iniciar Sesión</a>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Guest/New Option */}
                            <div 
                                onClick={() => setAuthMethod("guest")}
                                className={cn(
                                    "border rounded-lg p-4 cursor-pointer transition-all duration-200",
                                    authMethod === "guest" ? "border-green-500/50 bg-zinc-900/80 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "border-zinc-800 hover:border-zinc-700 bg-[#111]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                        authMethod === "guest" ? "border-green-500 bg-green-500 text-black" : "border-zinc-600"
                                    )}>
                                        {authMethod === "guest" && <Check size={12} strokeWidth={3} />}
                                    </div>
                                    <span className={cn("font-medium", authMethod === "guest" ? "text-white" : "text-zinc-300")}>Nuevo cliente (Continuar)</span>
                                </div>
                                
                                {authMethod === "guest" && (
                                    <div className="mt-6 pt-4 border-t border-zinc-800 cursor-default animate-in fade-in slide-in-from-top-1">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-zinc-400">Nombre</Label>
                                                <Input 
                                                    id="name" 
                                                    type="text" 
                                                    placeholder="Juan Pérez"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="bg-black border-zinc-700 focus:border-green-500 focus:ring-green-500/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-zinc-400">Correo Electrónico</Label>
                                                <Input 
                                                    id="email" 
                                                    type="email" 
                                                    placeholder="juan@ejemplo.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="bg-black border-zinc-700 focus:border-green-500 focus:ring-green-500/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-zinc-400">Teléfono</Label>
                                                <Input 
                                                    id="phone" 
                                                    type="tel" 
                                                    placeholder="+52 55 1234 5678"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="bg-black border-zinc-700 focus:border-green-500 focus:ring-green-500/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="country" className="text-zinc-400">País</Label>
                                                <Input 
                                                    id="country" 
                                                    type="text" 
                                                    placeholder="México"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    className="bg-black border-zinc-700 focus:border-green-500 focus:ring-green-500/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="card" className="text-zinc-400">Contraseña</Label>
                                                <Input 
                                                    id="card" 
                                                    type="password" 
                                                    placeholder="********"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                    className="bg-black border-zinc-700 focus:border-green-500 focus:ring-green-500/20"
                                                />
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-xs text-green-500">Crearemos una cuenta segura automática para que puedas seguir tu pedido.</p>
                                            </div>

                                            <div className="pt-4 pb-2">
                                                <Label className="text-base text-zinc-300">Método de Pago</Label>
                                            </div>

                                            <RadioGroup 
                                                value={paymentMethod} 
                                                onValueChange={handlePaymentMethodChange} 
                                                className="space-y-3"
                                            >
                                                <div className={cn("flex items-center space-x-2 border rounded-lg p-3 transition-colors", paymentMethod === 'transfer' ? 'border-green-500 bg-zinc-900' : 'border-zinc-700 hover:border-zinc-600')}>
                                                    <RadioGroupItem value="transfer" id="transfer" className="text-green-500 border-zinc-500" />
                                                    <Label htmlFor="transfer" className="cursor-pointer flex-1">Transferencia Bancaria</Label>
                                                </div>
                                                <div className={cn("flex items-center space-x-2 border rounded-lg p-3 transition-colors", paymentMethod === 'cash_on_delivery' ? 'border-green-500 bg-zinc-900' : 'border-zinc-700 hover:border-zinc-600')}>
                                                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" className="text-green-500 border-zinc-500" />
                                                    <Label htmlFor="cash_on_delivery" className="cursor-pointer flex-1">Pago contra Entrega</Label>
                                                </div>
                                            </RadioGroup>

                                            {paymentMethod === "transfer" && (
                                                <div className="mt-4 p-4 bg-zinc-900 rounded-lg animate-in fade-in slide-in-from-top-2 border border-zinc-800">
                                                    <Accordion type="multiple" value={openPaymentMethods} onValueChange={setOpenPaymentMethods} className="w-full mb-4">
                                                        <AccordionItem value="nequi" className="border-zinc-800">
                                                            <AccordionTrigger className="hover:no-underline py-2 text-zinc-300 hover:text-white">
                                                                <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                                    <Image src="/bancos/nequi.svg" alt="Nequi" width={40} height={40} />
                                                                    <span className="text-base text-black font-bold">Nequi</span>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="flex flex-col items-center pt-2">
                                                                <Image src="/qrnequi.webp" alt="QR Nequi" width={150} height={150} className="rounded-lg mb-2" />
                                                                <p className="text-xs text-zinc-400 mb-2">Envía el comprobante abajo</p>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="bancolombia" className="border-zinc-800">
                                                            <AccordionTrigger className="hover:no-underline py-2 text-zinc-300 hover:text-white">
                                                                <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                                    <Image src="/bancos/bancolombia.svg" alt="Bancolombia" width={40} height={40} />
                                                                    <span className="text-base text-black font-bold">Bancolombia</span>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="flex flex-col items-center pt-2">
                                                                <Image src="/qrbancolombia.jpeg" alt="QR Bancolombia" width={150} height={150} className="rounded-lg mb-2" />
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs font-mono bg-black px-2 py-1 rounded text-zinc-300">08895966552</span>
                                                                    <Button variant="outline" size="sm" className="h-6 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => copyToClipboard("08895966552")}>
                                                                        {copied === "08895966552" ? <Check size={12} /> : <Copy size={12} />}
                                                                        <span className="ml-1">{copied === "08895966552" ? "Copiado" : "Copiar"}</span>
                                                                    </Button>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="bbva" className="border-zinc-800">
                                                            <AccordionTrigger className="hover:no-underline py-2 text-zinc-300 hover:text-white">
                                                                <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                                    <Image src="/bancos/bbva.svg" alt="BBVA" width={40} height={40} />
                                                                    <span className="text-base text-black font-bold">BBVA</span>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="flex flex-col items-center pt-2">
                                                                <p className="text-sm text-zinc-300 mb-2">bbva@latorreimperial.com</p>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs font-mono bg-black px-2 py-1 rounded text-zinc-300">bbva@latorreimperial.com</span>
                                                                    <Button variant="outline" size="sm" className="h-6 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => copyToClipboard("bbva@latorreimperial.com")}>
                                                                        {copied === "bbva@latorreimperial.com" ? <Check size={12} /> : <Copy size={12} />}
                                                                        <span className="ml-1">{copied === "bbva@latorreimperial.com" ? "Copiado" : "Copiar"}</span>
                                                                    </Button>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="daviplata" className="border-zinc-800">
                                                            <AccordionTrigger className="hover:no-underline py-2 text-zinc-300 hover:text-white">
                                                                <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                                    <Image src="/bancos/daviplata.svg" alt="Daviplata" width={40} height={40} />
                                                                    <span className="text-base text-black font-bold">Daviplata</span>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="flex flex-col items-center pt-2">
                                                                <Image src="/qrdaviplata.webp" alt="QR Daviplata" width={150} height={150} className="rounded-lg mb-2" />
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs font-mono bg-black px-2 py-1 rounded text-zinc-300">3178898234</span>
                                                                    <Button variant="outline" size="sm" className="h-6 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => copyToClipboard("3178898234")}>
                                                                        {copied === "3178898234" ? <Check size={12} /> : <Copy size={12} />}
                                                                        <span className="ml-1">{copied === "3178898234" ? "Copiado" : "Copiar"}</span>
                                                                    </Button>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="westernunion" className="border-zinc-800">
                                                            <AccordionTrigger className="hover:no-underline py-2 text-zinc-300 hover:text-white">
                                                                <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                                    <Image src="/bancos/western-union.svg" alt="Western Union" width={40} height={40} />
                                                                    <span className="text-base text-black font-bold">Western Union</span>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="flex flex-col items-center pt-2">
                                                                <p className="text-sm text-zinc-300 mb-2">western@latorreimperial.com</p>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs font-mono bg-black px-2 py-1 rounded text-zinc-300">western@latorreimperial.com</span>
                                                                    <Button variant="outline" size="sm" className="h-6 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => copyToClipboard("western@latorreimperial.com")}>
                                                                        {copied === "western@latorreimperial.com" ? <Check size={12} /> : <Copy size={12} />}
                                                                        <span className="ml-1">{copied === "western@latorreimperial.com" ? "Copiado" : "Copiar"}</span>
                                                                    </Button>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="payment-proof" className="text-sm text-zinc-400">Subir Comprobante</Label>
                                                        <Input
                                                            id="payment-proof"
                                                            type="file"
                                                            accept="image/jpeg,image/png"
                                                            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                                                            className="bg-black border-zinc-700 text-sm file:bg-zinc-800 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2 file:text-xs hover:file:bg-zinc-700"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="pt-4">
                                                <Button 
                                                    onClick={handleCompleteOrder} 
                                                    disabled={(paymentMethod === "transfer" && !paymentProof) || uploading} 
                                                    className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-lg font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all"
                                                >
                                                    {uploading ? "Procesando..." : "Completar Pedido"}
                                                </Button>
                                            </div>
                                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                             <div className="bg-zinc-900 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                   <Check size={16} />
                                </div>
                                <div className="flex-1">
                                   <p className="text-sm font-medium text-white">Sesión iniciada</p>
                                   <p className="text-xs text-zinc-400">Completando compra como usuario registrado</p>
                                </div>
                             </div>

                             <div className="space-y-4 animate-in fade-in">
                                   <div className="space-y-2">
                                         <Label className="text-base text-zinc-300">Método de Pago</Label>
                                         <RadioGroup 
                                             value={paymentMethod} 
                                             onValueChange={handlePaymentMethodChange} 
                                             className="space-y-3"
                                         >
                                             <div className={cn("flex items-center space-x-2 border rounded-lg p-3 transition-colors", paymentMethod === 'transfer' ? 'border-green-500 bg-zinc-900/50' : 'border-zinc-700 hover:border-zinc-600')}>
                                                 <RadioGroupItem value="transfer" id="transfer-logged" className="text-green-500 border-zinc-500" />
                                                 <Label htmlFor="transfer-logged" className="cursor-pointer flex-1">Transferencia Bancaria</Label>
                                             </div>
                                             <div className={cn("flex items-center space-x-2 border rounded-lg p-3 transition-colors", paymentMethod === 'cash_on_delivery' ? 'border-green-500 bg-zinc-900/50' : 'border-zinc-700 hover:border-zinc-600')}>
                                                 <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery-logged" className="text-green-500 border-zinc-500" />
                                                 <Label htmlFor="cash_on_delivery-logged" className="cursor-pointer flex-1">Pago contra Entrega</Label>
                                             </div>
                                         </RadioGroup>
                                   </div>

                                   {paymentMethod === "transfer" && (
                                      <div className="mt-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800 animate-in fade-in slide-in-from-top-2">
                                         <Accordion type="multiple" value={openPaymentMethods} onValueChange={setOpenPaymentMethods} className="w-full mb-4">
                                             <AccordionItem value="nequi-log" className="border-zinc-800">
                                                 <AccordionTrigger className="py-2 text-zinc-300 hover:text-white">
                                                     <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                         <Image src="/bancos/nequi.svg" alt="Nequi" width={40} height={40} />
                                                         <span className="text-base text-black font-bold">Nequi</span>
                                                     </div>
                                                 </AccordionTrigger>
                                                 <AccordionContent className="flex justify-center pt-2">
                                                     <Image src="/qrnequi.webp" alt="QR Nequi" width={150} height={150} className="rounded" />
                                                 </AccordionContent>
                                             </AccordionItem>
                                             <AccordionItem value="bancolombia-log" className="border-zinc-800">
                                                 <AccordionTrigger className="py-2 text-zinc-300 hover:text-white">
                                                     <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                         <Image src="/bancos/bancolombia.svg" alt="Bancolombia" width={40} height={40} />
                                                         <span className="text-base text-black font-bold">Bancolombia</span>
                                                     </div>
                                                 </AccordionTrigger>
                                                 <AccordionContent className="flex flex-col items-center pt-2">
                                                     <Image src="/qrbancolombia.jpeg" alt="QR Bancolombia" width={150} height={150} className="rounded" />
                                                      <div className="flex items-center gap-2 mt-2">
                                                         <span className="text-xs font-mono bg-black px-2 py-1 rounded text-zinc-300">08895966552</span>
                                                         <Button variant="outline" size="sm" className="h-6 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => copyToClipboard("08895966552")}>
                                                            {copied === "08895966552" ? <Check size={12} /> : <Copy size={12} />}
                                                            <span className="ml-1">{copied === "08895966552" ? "Copiado" : "Copiar"}</span>
                                                         </Button>
                                                      </div>
                                                 </AccordionContent>
                                             </AccordionItem>
                                             <AccordionItem value="bbva-log" className="border-zinc-800">
                                                 <AccordionTrigger className="py-2 text-zinc-300 hover:text-white">
                                                     <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                         <Image src="/bancos/bbva.svg" alt="BBVA" width={40} height={40} />
                                                         <span className="text-base text-black font-bold">BBVA</span>
                                                     </div>
                                                 </AccordionTrigger>
                                                 <AccordionContent className="flex flex-col items-center pt-2">
                                                     <p className="text-sm text-zinc-300 mb-2">bbva@latorreimperial.com</p>
                                                     <div className="flex items-center gap-2 mt-2">
                                                         <span className="text-xs font-mono bg-black px-2 py-1 rounded text-zinc-300">bbva@latorreimperial.com</span>
                                                         <Button variant="outline" size="sm" className="h-6 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => copyToClipboard("bbva@latorreimperial.com")}>
                                                            {copied === "bbva@latorreimperial.com" ? <Check size={12} /> : <Copy size={12} />}
                                                            <span className="ml-1">{copied === "bbva@latorreimperial.com" ? "Copiado" : "Copiar"}</span>
                                                         </Button>
                                                     </div>
                                                 </AccordionContent>
                                             </AccordionItem>
                                             <AccordionItem value="daviplata-log" className="border-zinc-800">
                                                 <AccordionTrigger className="py-2 text-zinc-300 hover:text-white">
                                                     <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                         <Image src="/bancos/daviplata.svg" alt="Daviplata" width={40} height={40} />
                                                         <span className="text-base text-black font-bold">Daviplata</span>
                                                     </div>
                                                 </AccordionTrigger>
                                                 <AccordionContent className="flex flex-col items-center pt-2">
                                                     <Image src="/qrdaviplata.webp" alt="QR Daviplata" width={150} height={150} className="rounded" />
                                                     <div className="flex items-center gap-2 mt-2">
                                                         <span className="text-xs font-mono bg-black px-2 py-1 rounded text-zinc-300">3178898234</span>
                                                         <Button variant="outline" size="sm" className="h-6 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => copyToClipboard("3178898234")}>
                                                            {copied === "3178898234" ? <Check size={12} /> : <Copy size={12} />}
                                                            <span className="ml-1">{copied === "3178898234" ? "Copiado" : "Copiar"}</span>
                                                         </Button>
                                                     </div>
                                                 </AccordionContent>
                                             </AccordionItem>
                                             <AccordionItem value="westernunion-log" className="border-zinc-800">
                                                 <AccordionTrigger className="py-2 text-zinc-300 hover:text-white">
                                                     <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                                                         <Image src="/bancos/western-union.svg" alt="Western Union" width={40} height={40} />
                                                         <span className="text-base text-black font-bold">Western Union</span>
                                                     </div>
                                                 </AccordionTrigger>
                                                 <AccordionContent className="flex flex-col items-center pt-2">
                                                     <p className="text-sm text-zinc-300 mb-2">western@latorreimperial.com</p>
                                                     <div className="flex items-center gap-2 mt-2">
                                                         <span className="text-xs font-mono bg-black px-2 py-1 rounded text-zinc-300">western@latorreimperial.com</span>
                                                         <Button variant="outline" size="sm" className="h-6 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => copyToClipboard("western@latorreimperial.com")}>
                                                            {copied === "western@latorreimperial.com" ? <Check size={12} /> : <Copy size={12} />}
                                                            <span className="ml-1">{copied === "western@latorreimperial.com" ? "Copiado" : "Copiar"}</span>
                                                         </Button>
                                                     </div>
                                                 </AccordionContent>
                                             </AccordionItem>
                                         </Accordion>
                                         <div className="space-y-2">
                                             <Label htmlFor="proof-log" className="text-sm text-zinc-400">Subir Comprobante</Label>
                                             <Input type="file" id="proof-log" accept="image/*" onChange={(e) => setPaymentProof(e.target.files?.[0] || null)} className="bg-black border-zinc-700 text-sm file:bg-zinc-800 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2 file:text-xs hover:file:bg-zinc-700" />
                                         </div>
                                      </div>
                                   )}

                                   <div className="pt-4">
                                     <Button 
                                         onClick={handleCompleteOrder} 
                                         disabled={uploading || (paymentMethod === "transfer" && !paymentProof)} 
                                         className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-lg font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all"
                                     >
                                         {uploading ? "Procesando..." : "Completar Pedido"}
                                     </Button>
                                   </div>
                                   {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                              </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
