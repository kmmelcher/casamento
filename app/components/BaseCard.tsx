import Image from "next/image";

type BaseCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export function BaseCard({
  title,
  description,
  imageUrl,
  badge,
  footer,
  onClick,
  disabled,
}: BaseCardProps) {
  const interactive = !!onClick && !disabled;

  return (
    <article
      className={`rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col transition h-full ${
        disabled
          ? "border-gray-200 opacity-75"
          : interactive
            ? "border-gray-200 hover:shadow-md hover:border-gray-300 cursor-pointer"
            : "border-gray-200"
      }`}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {imageUrl ? (
        <div className="relative aspect-[4/3] bg-gray-100">
          {imageUrl.startsWith("data:") ? (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {badge}
        </div>
      ) : (
        <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Sem imagem
          {badge}
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm mt-1 flex-1">{description}</p>
        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>
        )}
      </div>
    </article>
  );
}
