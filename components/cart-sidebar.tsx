"use client";

import { ShoppingCart, Minus, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import type { CartItem } from "@/lib/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PersonalizedRecommendations } from "@/components/personalized-recommendations";
import { getAuthStatus } from "@/lib/actions/auth-status";

// Colores disponibles
const colors = [
  { name: "Negro", value: "bg-gray-900", index: 1 },
  { name: "Blanco", value: "bg-gray-100", index: 2 },
  { name: "Rosado", value: "bg-pink-300", index: 3 },
  { name: "Azul claro", value: "bg-blue-300", index: 4 },
  { name: "Azul", value: "bg-blue-600", index: 5 },
  { name: "Verde", value: "bg-green-500", index: 6 },
  { name: "Gris", value: "bg-gray-400", index: 7 },
]

// Marcas disponibles
const brands = [
  { name: "Adidas" },
  { name: "Nike" },
  { name: "Under" },
]

interface CartSidebarProps {
  cart: CartItem[];
  itemCount: number;
  total: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onUpdateCartItem: (productId: string, color?: string, size?: string, brand?: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSidebar({
  cart,
  itemCount,
  total,
  onUpdateQuantity,
  onRemove,
  onUpdateCartItem,
  onClear,
  isOpen,
  onOpenChange,
}: CartSidebarProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editColor, setEditColor] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const router = useRouter();

  // Cierra y redirige a home si el carrito se vacía mientras está abierto
  useEffect(() => {
    if (cart.length === 0 && isOpen) {
      onOpenChange(false);
      router.push("/");
    }
  }, [cart.length, isOpen, onOpenChange, router]);

  const handleCheckout = () => {
    onOpenChange(false);
    router.push("/checkout");
  };

  const startEditing = (item: CartItem) => {
    setEditingItem(item.id);
    setEditColor(item.color || "");
    setEditBrand(item.brand || "");
  };

  const saveEdit = (itemId: string) => {
    if (editColor || editBrand) {
      onUpdateCartItem(itemId, editColor, undefined, editBrand);
    }
    setEditingItem(null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditColor("");
    setEditBrand("");
  };

  return (
    <div suppressHydrationWarning>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative bg-transparent"
            aria-label="View cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {itemCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-4">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Carrito</span>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClear}>
                  Vaciar Carrito
                </Button>
              )}
            </SheetTitle>
            <p className="text-sm text-muted-foreground text-left">
              Revisa tus artículos y procede al pago seguro.
            </p>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground">
                Agrega algunos productos para comenzar
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {cart.map((item) => {
                const discountedPrice = (() => {
                  if (item.quantity === 2) return item.price * 0.95;
                  if (item.quantity === 3) return item.price * 0.92;
                  if (item.quantity === 4) return item.price * 0.9;
                  return item.price;
                })();
                const totalForItem = discountedPrice * item.quantity;
                const isEditing = editingItem === item.id;

                return (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm flex items-center gap-2">
                            {item.name}
                            {item.quantity === 2 && <span className="bg-blue-500 text-white text-xs px-1 rounded">5% OFF</span>}
                            {item.quantity === 3 && <span className="bg-red-500 text-white text-xs px-1 rounded">8% OFF</span>}
                            {item.quantity === 4 && <span className="bg-green-500 text-white text-xs px-1 rounded">10% OFF</span>}
                          </h3>
                          
                          {isEditing ? (
                            // Modo edición
                            <div className="mt-2 space-y-2">
                              <div>
                                <span className="text-xs text-muted-foreground">Color:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {colors.map((color) => (
                                    <button
                                      key={color.name}
                                      onClick={() => setEditColor(color.name)}
                                      className={`w-6 h-6 rounded-full ${color.value} border-2 ${
                                        editColor === color.name ? "border-yellow-500 scale-110" : "border-gray-300"
                                      }`}
                                      title={color.name}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Marca:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {brands.map((brand) => (
                                    <button
                                      key={brand.name}
                                      onClick={() => setEditBrand(brand.name)}
                                      className={`px-2 py-0.5 text-xs rounded border ${
                                        editBrand === brand.name ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
                                      }`}
                                    >
                                      {brand.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={() => saveEdit(item.id)} className="h-6 w-6 p-0">
                                  <Check className="h-3 w-3 text-green-500" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-6 w-6 p-0">
                                  <X className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Modo visualización
                            <>
                              {(item.color || item.size || item.brand) && (
                                <p className="text-xs text-muted-foreground">
                                  {item.brand && `Marca: ${item.brand}`}
                                  {item.brand && item.color && " | "}
                                  {item.color && `Color: ${item.color}`}
                                  {(item.brand || item.color) && item.size && " | "}
                                  {item.size && `Talla: ${item.size}`}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                ${discountedPrice} c/u
                              </p>
                            </>
                          )}
                        </div>
                      <div className="flex gap-1">
                        {!isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(item)}
                            className="h-8 w-8"
                            title="Editar color/marca"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemove(item.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="h-8 w-8"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-semibold">${totalForItem}</div>
                    </div>
                  </div>
                </div>
                );
              })}

              {/* Personalized Recommendations */}
              {cart.length > 0 && (
                <div className="border-t pt-4">
                  <PersonalizedRecommendations />
                </div>
              )}

              {/* Coupon section */}
              <div className="flex items-center gap-2 pt-4">
                <Input placeholder="Ingresa código de cupón" className="flex-1" />
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                  Aplicar
                </Button>
              </div>

              {/* Subtotal and Total */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${total}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Accept Terms */}
              <Card className="p-4 mt-4">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) =>
                        setTermsAccepted(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left"
                    >
                      Aceptar Términos (Requerido)
                      <a
                        href="/terms-and-conditions"
                        className="text-blue-500 hover:underline ml-1"
                      >
                        Puedes leer nuestros términos y condiciones haciendo clic aquí.
                      </a>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Button */}
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="lg"
                disabled={!termsAccepted}
                onClick={handleCheckout}
              >
                Pagar ${total}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
