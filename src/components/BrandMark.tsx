// Official PPMI Mesir logo (supplied by the project owner).
// Original: assets/originals/logo-ppmi-mesir.png; web sizes in public/images.
export function BrandMark({ className = "brand__mark" }: { className?: string }) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet="/images/logo-ppmi-mesir-96.webp 1x, /images/logo-ppmi-mesir-192.webp 2x" />
      <img src="/images/logo-ppmi-mesir-96.png" srcSet="/images/logo-ppmi-mesir-192.png 2x" alt="" width={45} height={42} decoding="async" />
    </picture>
  );
}
