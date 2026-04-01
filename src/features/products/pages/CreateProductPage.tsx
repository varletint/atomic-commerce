import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Package } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { NumberInput } from '@/components/ui/NumberInput';
import { ImageUploader } from '../components/ImageUploader';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { createProductSchema, type CreateProductFormValues } from '@/schemas/createProduct.schema';

interface ImageFileEntry {
  file: File;
  preview: string;
  isPrimary: boolean;
}

export function CreateProductPage() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<ImageFileEntry[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      productType: 'physical',
      weightUnit: 'g',
      isFeatured: false,
      minOrderQty: 1,
      initialStock: 0,
    },
  });

  const createMutation = useCreateProduct({
    onSuccess: () => {
      toast.success('Product created successfully!');
      navigate(ROUTES.PRODUCTS);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });

  const onImagesChange = useCallback((files: ImageFileEntry[]) => {
    setImageFiles(files);
  }, []);

  const onSubmit = (data: CreateProductFormValues) => {
    createMutation.mutate({
      formData: data,
      imageFiles: imageFiles.map((img) => ({
        file: img.file,
        isPrimary: img.isPrimary,
      })),
    });
  };

  const isSubmitting = createMutation.isPending;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO title="Create Product — Atomic Order" description="Add a new product to your catalog." />

      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 border border-[var(--color-border-strong)] hover:bg-[var(--color-bg-muted)] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--color-text-heading)] flex items-center gap-3">
              <Package size={24} />
              Create Product
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Add a new product to your catalog
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ── Section: Basic Info ────────────── */}
          <section className="border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-heading)] mb-6 pb-3 border-b border-[var(--color-border)]">
              Basic Information
            </h2>
            <div className="space-y-1">
              <Input
                label="Product Name"
                placeholder="e.g. Premium Running Shoes"
                error={errors.name?.message}
                {...register('name')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Category"
                  placeholder="e.g. Footwear"
                  error={errors.category?.message}
                  {...register('category')}
                />
                <Input
                  label="Brand"
                  placeholder="e.g. Nike"
                  error={errors.brand?.message}
                  {...register('brand')}
                />
              </div>
              <Select
                label="Product Type"
                options={[
                  { value: 'physical', label: 'Physical' },
                  { value: 'digital', label: 'Digital' },
                  { value: 'service', label: 'Service' },
                ]}
                error={errors.productType?.message}
                {...register('productType')}
              />
              <Input
                label="Short Description"
                placeholder="Brief one-liner"
                error={errors.shortDescription?.message}
                {...register('shortDescription')}
              />
              <div>
                <label className="input-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Detailed product description..."
                  className={`input-field resize-none ${errors.description ? 'input-error' : ''}`}
                  {...register('description')}
                />
                {errors.description && (
                  <span className="input-error-text">{errors.description.message}</span>
                )}
              </div>
            </div>
          </section>

          {/* ── Section: Pricing ──────────────── */}
          <section className="border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-heading)] mb-6 pb-3 border-b border-[var(--color-border)]">
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumberInput
                label="Price (₦)"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register('price')}
              />
              <NumberInput
                label="Compare-at Price"
                step="0.01"
                placeholder="Optional"
                error={errors.compareAtPrice?.message}
                {...register('compareAtPrice')}
              />
              <NumberInput
                label="Cost Price"
                step="0.01"
                placeholder="Optional"
                error={errors.costPrice?.message}
                {...register('costPrice')}
              />
            </div>
          </section>

          {/* ── Section: Images ───────────────── */}
          <section className="border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-heading)] mb-6 pb-3 border-b border-[var(--color-border)]">
              Product Images
            </h2>
            <ImageUploader onChange={onImagesChange} maxFiles={8} />
          </section>

          {/* ── Section: Inventory ────────────── */}
          <section className="border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-heading)] mb-6 pb-3 border-b border-[var(--color-border)]">
              Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="Initial Stock"
                placeholder="0"
                error={errors.initialStock?.message}
                {...register('initialStock')}
              />
              <NumberInput
                label="Minimum Order Qty"
                placeholder="1"
                error={errors.minOrderQty?.message}
                {...register('minOrderQty')}
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                className="w-4 h-4 accent-[var(--color-accent)]"
                {...register('isFeatured')}
              />
              <label
                htmlFor="isFeatured"
                className="text-sm font-semibold text-[var(--color-text-heading)] uppercase tracking-wide cursor-pointer"
              >
                Featured Product
              </label>
            </div>
          </section>

          {/* ── Section: Shipping ─────────────── */}
          <section className="border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-heading)] mb-6 pb-3 border-b border-[var(--color-border)]">
              Shipping & Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumberInput
                label="Weight"
                step="0.01"
                placeholder="Optional"
                error={errors.weight?.message}
                {...register('weight')}
              />
              <Select
                label="Weight Unit"
                options={[
                  { value: 'g', label: 'Grams (g)' },
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'lb', label: 'Pounds (lb)' },
                  { value: 'oz', label: 'Ounces (oz)' },
                ]}
                error={errors.weightUnit?.message}
                {...register('weightUnit')}
              />
              <Input
                label="Material"
                placeholder="e.g. Cotton, Leather"
                error={errors.material?.message}
                {...register('material')}
              />
            </div>
          </section>

          {/* ── Section: Tags ─────────────────── */}
          <section className="border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-heading)] mb-6 pb-3 border-b border-[var(--color-border)]">
              Tags
            </h2>
            <Input
              label="Tags"
              placeholder="e.g. summer, casual, trending (comma-separated)"
              error={errors.tags?.message}
              {...register('tags')}
            />
          </section>

          {/* ── Submit ────────────────────────── */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
