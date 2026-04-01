import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { productApi, type CreateProductPayload } from '../api/productApi';
import { storageApi, type UploadUrlResponse } from '../api/storageApi';
import type { CreateProductFormValues } from '@/schemas/createProduct.schema';

interface ImageFile {
  file: File;
  isPrimary: boolean;
}

interface UseCreateProductOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCreateProduct(options?: UseCreateProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      imageFiles,
    }: {
      formData: CreateProductFormValues;
      imageFiles: ImageFile[];
    }) => {
      const uploadedMoves: { tempKey: string; finalKey: string }[] = [];
      const rollbackKeys: string[] = [];

      try {
        // 1. Upload images to R2
        const formattedImages: CreateProductPayload['images'] = [];

        if (imageFiles.length > 0) {
          for (let i = 0; i < imageFiles.length; i++) {
            const { file, isPrimary } = imageFiles[i];

            const uploadInfo: UploadUrlResponse = await storageApi.getUploadUrl(
              'products/images',
              file.name,
              file.type
            );

            rollbackKeys.push(uploadInfo.tempKey);
            await storageApi.uploadToR2(uploadInfo.uploadUrl, file);
            uploadedMoves.push({ tempKey: uploadInfo.tempKey, finalKey: uploadInfo.finalKey });

            formattedImages.push({
              url: uploadInfo.publicUrl,
              altText: file.name.replace(/\.[^/.]+$/, ''),
              sortOrder: i,
              isPrimary,
            });
          }
        }

        // 2. Build payload
        const payload: CreateProductPayload = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          productType: formData.productType,
          images: formattedImages,
          initialStock: formData.initialStock,
          minOrderQty: formData.minOrderQty,
          isFeatured: formData.isFeatured,
        };

        // Optionals
        if (formData.shortDescription) payload.shortDescription = formData.shortDescription;
        if (formData.compareAtPrice != null) payload.compareAtPrice = formData.compareAtPrice;
        if (formData.costPrice != null) payload.costPrice = formData.costPrice;
        if (formData.brand) payload.brand = formData.brand;
        if (formData.weight != null) {
          payload.weight = formData.weight;
          payload.weightUnit = formData.weightUnit;
        }
        if (formData.material) payload.material = formData.material;
        if (formData.tags) {
          payload.tags = formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        }

        // 3. Create the product
        const result = await productApi.createProduct(payload);

        // 4. Confirm uploads (move temp → permanent)
        if (uploadedMoves.length > 0) {
          await storageApi.confirmUploads(uploadedMoves);
        }

        return result;
      } catch (error) {
        // Rollback uploaded files on failure
        if (rollbackKeys.length > 0) {
          storageApi.rollbackUploads(rollbackKeys).catch(console.error);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
