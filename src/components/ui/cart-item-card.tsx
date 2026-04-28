"use client";

import { Coffee } from "lucide-react";
import Image from "next/image";

interface CartItemCardProps {
  imageUrl?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  decrementButton: React.ReactNode;
  incrementButton: React.ReactNode;
  removeButton: React.ReactNode;
}

export function CartItemCard({
  imageUrl,
  name,
  unitPrice,
  quantity,
  decrementButton,
  incrementButton,
  removeButton,
}: CartItemCardProps) {
  const lineTotal = unitPrice * quantity;

  return (
    <div className="flex items-center gap-4 bg-base-100 border border-base-content/10 p-4 transition-all duration-500 hover:border-base-content/25 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative w-24 h-24 shrink-0 overflow-hidden">
        {imageUrl ? (
          <Image
            fill
            src={imageUrl}
            alt={name}
            className="object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Coffee className="w-10 h-10 text-base-content/30" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-base truncate">{name}</h2>
        <p className="text-sm text-base-content/60 mt-0.5">
          ${unitPrice.toFixed(2)} each
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          {decrementButton}
          <span className="w-6 text-center font-medium text-sm">
            {quantity}
          </span>
          {incrementButton}
        </div>

        <p className="font-bold text-sm w-16 text-right">
          ${lineTotal.toFixed(2)}
        </p>

        {removeButton}
      </div>
    </div>
  );
}
