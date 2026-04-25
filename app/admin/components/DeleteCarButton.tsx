"use client";

import { deleteCar } from "@/app/actions/cars";
import { useTransition } from "react";

export default function DeleteCarButton({ carId }: { carId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteCar(carId);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-900/40 hover:text-red-300 disabled:opacity-50 transition"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
