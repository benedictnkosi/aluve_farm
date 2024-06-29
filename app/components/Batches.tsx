import React from "react";
import { BatchCard } from "./BatchCard";
import { Card, Spinner } from "flowbite-react";

interface BatchListProps {
  batch_list: Array<any>;
  isLoading: boolean;
}

const BatchesList = ({ batch_list, isLoading }: BatchListProps) => {
  return (
    <Card className="m-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Batches
        </p>
      </div>
      {isLoading && <Spinner aria-label="loading" />}
      <div className="flex flex-wrap">
          {batch_list.map((batch, index) => (
            <BatchCard
              key={index}
              name={batch.name}
              seedlingDate={batch.seedling_date ? new Date(batch.seedling_date.seconds * 1000).toLocaleDateString() : ''}
              seedlingQuantity={batch.seedling_quantity}
              transplantDate={batch.transplant_date ? new Date(batch.transplant_date.seconds * 1000).toLocaleDateString() : ''}
              transplantQuantity={batch.transplant_quantity}
              harvestDate={batch.harvest_date ? new Date(batch.harvest_date.seconds * 1000).toLocaleDateString() : ''}
              harvestQuantity={batch.harvest_quantity}
              crop_seedling_days={batch.crop.seedling_days}
            />
          ))}

          {/* Rest of the list items */}
      </div>
    </Card>
  );
};

export default BatchesList;
