import { Button, Card } from "flowbite-react";
import Image from "next/image";
export interface BatchCardProps {
  name: string;
  seedlingDate: string;
  seedlingQuantity: number;
  transplantDate: string;
  transplantQuantity: number;
  harvestDate: string;
  harvestQuantity: number;
  crop_seedling_days: number;
}

export function BatchCard({
  name,
  seedlingDate,
  seedlingQuantity,
  transplantDate,
  transplantQuantity,
  harvestDate,
  harvestQuantity,
  crop_seedling_days
}: BatchCardProps) {
  return (
    <Card className="max-w-sm m-3">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {name}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Nursery: {seedlingDate} - {seedlingQuantity}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {transplantQuantity !== undefined ? (
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Harvested: {transplantDate} - {transplantQuantity}
          </p>
        ) : (
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Planned Transplant: {transplantDate}
          </p>
        )}

      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {harvestQuantity !== undefined ? (
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Harvested: {harvestDate} - {harvestQuantity}
          </p>
        ) : (
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Planned Harvest: {harvestDate}
          </p>
        )}
      </p>
      <Button>
        Read more
        <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </Card>
  );
}
