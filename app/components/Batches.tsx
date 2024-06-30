import React from "react";
import { BatchTableRow } from "./BatchTableRow";
import { Card, Spinner, Table } from "flowbite-react";

interface BatchListProps {
  batch_list: Array<any>;
  isLoading: boolean;
  harvestFunction: (id: string,selectedBatch: string, harvestUnit: string, harvestArray: Array<any>) => void;
  transplantFunction: (id: string,selectedBatch: string, transplantArray: Array<any>) => void;
}

const BatchesList = ({ batch_list, isLoading, transplantFunction, harvestFunction }: BatchListProps) => {
  return (
    <Card className="m-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Batches
        </p>
      </div>
      {isLoading && <Spinner aria-label="loading" />}
      <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Seddling Date</Table.HeadCell>
          <Table.HeadCell>Quantity</Table.HeadCell>
          <Table.HeadCell>Transplant</Table.HeadCell>
          <Table.HeadCell>Harvest</Table.HeadCell>
          <Table.HeadCell>
          Actions
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
        {batch_list.map((batch, index) => (
            <BatchTableRow
              key={index}
              name={batch.name}
              seedlingDate={batch.seedling_date ? new Date(batch.seedling_date.seconds * 1000).toLocaleDateString() : ''}
              seedlingQuantity={batch.seedling_quantity}
              transplant={batch.transplant}
              harvest={batch.harvest}
              crop_seedling_days={batch.crop.seedling_days}
              transplantFunction={transplantFunction}
              harvestFunction={harvestFunction}
              harvestUnits={batch.harvest_units}
              batchId={batch.id}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
    </Card>
  );
};

export default BatchesList;
