export function Avatar({
    picture,
    name,
    isCurrent = false,
}: {
    picture: string;
    name: string;
    isCurrent?: boolean;
}) {
    return (
        <div
            className={`relative w-10 h-10 rounded-full overflow-hidden border-2
        ${isCurrent
                    ? "border-green-400 dark:border-green-500 shadow-md shadow-green-400/50"
                    : "border-gray-400 dark:border-gray-600"
                }`}
        >
            <img
                src={picture}
                alt={name}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
