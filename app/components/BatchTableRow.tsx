import { Button, Card, Table } from "flowbite-react";
import Image from "next/image";
export interface BatchCardProps {
  name: string;
  seedlingDate: string;
  seedlingQuantity: number;
  transplant: Array<any>;
  harvest: Array<any>;
  crop_seedling_days: number;
  transplantFunction: (id: string, selectedBatch: string, transplantArray: Array<any>) => void;
  harvestFunction: (id: string,selectedBatch: string, harvestUnit: string, harvestArray: Array<any>) => void;
  harvestUnits: string;
  batchId: string;
}

export function BatchTableRow({
  name,
  seedlingDate,
  seedlingQuantity,
  transplant,
  harvest,
  crop_seedling_days,
  transplantFunction,
  harvestFunction,
  harvestUnits,
  batchId
}: BatchCardProps) {

  const transplantString = transplant.map((item) => (
    <p key={item.date.seconds}>
      {new Date(item.date.seconds * 1000).toLocaleDateString()} - {item.quantity ? item.quantity : "Planned"}
    </p>
  ));

  const harvestString = harvest.map((item) => (
      <p key={item.date.seconds}>
        {new Date(item.date.seconds * 1000).toLocaleDateString()} -  {item.quantity ? item.quantity : "Planned"}
      </p>
    ));

  return (
    <Table.Row className={`bg-white dark:border-gray-700 dark:bg-gray-800`}>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {name}
      </Table.Cell>
      <Table.Cell>{seedlingDate}</Table.Cell>
      <Table.Cell>{seedlingQuantity}</Table.Cell>
      <Table.Cell>
        {transplantString}
      </Table.Cell>
      <Table.Cell>
        {harvestString}
      </Table.Cell>
      <Table.Cell>
        <a href="#" className="text-blue-500 dark:text-blue-400 mr-2" onClick={() => transplantFunction(batchId, name, transplant)}>Transplant</a>
        <a href="#" className="text-blue-500 dark:text-blue-400 mr-2" onClick={() => harvestFunction(batchId, name, harvestUnits, harvest)}>Harvest</a>
      </Table.Cell>
    </Table.Row>
  );
}
