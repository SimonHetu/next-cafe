"use client";

import { RoastLevel } from "@/src/generated/prisma/enums";
import {
  createProductAction,
  updateProductAction,
} from "@/src/lib/products/product.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type ProductFormMode = "create" | "edit";

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  detailDescription: string;
  imageUrl: string;
  price: number;
  roastLevel: RoastLevel;
  origin: string;
};

interface ProductFormProps {
  mode: ProductFormMode;
  productId?: string;
  initialValues?: Partial<ProductFormValues>;
}

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  detailDescription: "",
  imageUrl: "",
  price: 0,
  roastLevel: RoastLevel.MEDIUM,
  origin: "",
};

export function ProductForm({ mode, productId, initialValues }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<ProductFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });

  const isEdit = mode === "edit";
  const submitLabel = useMemo(
    () => (isLoading ? "Saving..." : isEdit ? "Update product" : "Create product"),
    [isEdit, isLoading]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const payload: ProductFormValues = {
      ...values,
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      detailDescription: values.detailDescription.trim(),
      imageUrl: values.imageUrl.trim(),
      origin: values.origin.trim(),
    };

    const result = isEdit
      ? await updateProductAction(productId ?? "", payload)
      : await createProductAction(payload);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="form-control w-full">
          <span className="label-text mb-1">Name</span>
          <input
            type="text"
            required
            className="input input-bordered w-full"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-1">Slug</span>
          <input
            type="text"
            required
            className="input input-bordered w-full"
            value={values.slug}
            onChange={(e) => setValues((prev) => ({ ...prev, slug: e.target.value }))}
          />
        </label>
      </div>

      <label className="form-control w-full">
        <span className="label-text mb-1">Short description</span>
        <textarea
          required
          className="textarea textarea-bordered w-full"
          rows={2}
          value={values.description}
          onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text mb-1">Detailed description</span>
        <textarea
          required
          className="textarea textarea-bordered w-full"
          rows={5}
          value={values.detailDescription}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, detailDescription: e.target.value }))
          }
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text mb-1">Image URL</span>
        <input
          type="string"
          required
          className="input input-bordered w-full"
          value={values.imageUrl}
          onChange={(e) => setValues((prev) => ({ ...prev, imageUrl: e.target.value }))}
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="form-control w-full">
          <span className="label-text mb-1">Price</span>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="input input-bordered w-full"
            value={values.price}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))
            }
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-1">Roast level</span>
          <select
            className="select select-bordered w-full"
            value={values.roastLevel}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                roastLevel: e.target.value as RoastLevel,
              }))
            }
          >
            {Object.values(RoastLevel).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-1">Origin</span>
          <input
            type="text"
            required
            className="input input-bordered w-full"
            value={values.origin}
            onChange={(e) => setValues((prev) => ({ ...prev, origin: e.target.value }))}
          />
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {submitLabel}
        </button>
        <Link href="/admin" className="btn btn-ghost" aria-disabled={isLoading}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
