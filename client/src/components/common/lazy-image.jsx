import { useState, useRef, useEffect } from "react";

function LazyImage({ src, alt, className, fallbackSrc, ...props }) {
  const fallbackImage = fallbackSrc || "https://via.placeholder.com/500x500/CCCCCC/666666?text=Product+Image";
  const [imageSrc, setImageSrc] = useState(src || fallbackImage);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Reset when src changes
    if (src && src !== imageSrc) {
      setImageSrc(src);
      setIsLoading(true);
      setHasError(false);
    }
  }, [src]);

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current && imgRef.current) {
      observerRef.current.unobserve(imgRef.current);
    }

    // Create new IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isLoading) {
            // Preload the image
            const img = new Image();
            img.src = imageSrc;
            
            img.onload = () => {
              setIsLoading(false);
              setHasError(false);
            };
            
            img.onerror = () => {
              setIsLoading(false);
              setHasError(true);
              if (imageSrc !== fallbackImage) {
                setImageSrc(fallbackImage);
              }
            };
            
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before the image enters viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [imageSrc, isLoading, fallbackImage]);

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackImage) {
      setHasError(true);
      setIsLoading(false);
      setImageSrc(fallbackImage);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt || "Product image"}
        className={`${className || ""} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onError={handleError}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
}

export default LazyImage;
