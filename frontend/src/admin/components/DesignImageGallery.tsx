"use client";

import { Image, Typography } from "antd";

type GalleryImage = {
  storageUrl: string;
  disclaimer?: string;
};

export function DesignImageGallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <div
        className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <Image.PreviewGroup>
          {images.map((img) => (
            <div
              key={img.storageUrl}
              className="w-[min(78vw,280px)] shrink-0 snap-center"
            >
              <Image
                src={img.storageUrl}
                alt=""
                className="!h-[min(52vw,220px)] !w-full rounded-xl object-cover"
                rootClassName="!block w-full"
              />
            </div>
          ))}
        </Image.PreviewGroup>
      </div>
      {images[0]?.disclaimer ? (
        <Typography.Text type="secondary" className="text-xs">
          {images[0].disclaimer}
        </Typography.Text>
      ) : null}
    </div>
  );
}
