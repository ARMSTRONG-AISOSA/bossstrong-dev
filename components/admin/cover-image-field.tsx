"use client";

import { useState, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { PostValues } from "@/lib/validation/post-schema";

// backend-specification.md §5.1: 3MB max, PNG/JPEG/WebP — the bucket config
// is the real gate, this is just fast client-side feedback before an upload
// even starts (blog-admin-specification.md §4.2).
const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function CoverImageField() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PostValues>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const coverImageUrl = watch("cover_image_url");

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only PNG, JPEG, or WebP images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("Image must be 3MB or smaller.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from("post-images")
      .upload(path, file);
    setIsUploading(false);

    if (error) {
      setUploadError("Upload failed. Please try again.");
      return;
    }

    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    setValue("cover_image_url", data.publicUrl, { shouldValidate: true });
  };

  const onRemove = () => {
    setValue("cover_image_url", "");
    setValue("cover_image_alt", "");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="cover-image">Cover Image</Label>
      {coverImageUrl ? (
        <div className="flex items-center gap-3">
          <Image
            src={coverImageUrl}
            alt=""
            width={96}
            height={64}
            className="h-16 w-24 rounded-md border border-border object-cover"
          />
          <Button type="button" variant="outline" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      ) : (
        <>
          <Input
            id="cover-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFileChange}
            disabled={isUploading}
          />
          <p className="text-tiny text-text-secondary">
            Max 3MB — PNG, JPEG, or WebP.
          </p>
        </>
      )}
      {isUploading ? (
        <p className="text-tiny text-text-secondary">Uploading…</p>
      ) : null}
      {uploadError ? (
        <p className="text-tiny text-destructive">{uploadError}</p>
      ) : null}

      {coverImageUrl ? (
        <div className="mt-2 flex flex-col gap-1.5">
          <Label htmlFor="cover-image-alt">Alt Text</Label>
          <Input
            id="cover-image-alt"
            aria-invalid={!!errors.cover_image_alt}
            {...register("cover_image_alt")}
          />
          {errors.cover_image_alt ? (
            <p className="text-tiny text-destructive">
              {errors.cover_image_alt.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
