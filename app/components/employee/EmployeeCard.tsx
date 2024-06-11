import Image from "next/image";
export interface EmployeeCardProps {
  name: string;
  phoneNumber: string;
  position: string;
  picture: string;
}

export function EmployeeCard({
  name,
  phoneNumber,
  position,
  picture
}: EmployeeCardProps) {
  return (
    <li className="py-3 sm:py-4">
    <div className="flex items-center space-x-4">
      <div className="shrink-0">
        <Image
          alt={name + " image"}
          height="32"
          src={picture}
          width="32"
          className="rounded-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {name}
        </p>
        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
          {phoneNumber}
        </p>
      </div>
      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
        {position}
      </div>
    </div>
    </li>
  );
}
