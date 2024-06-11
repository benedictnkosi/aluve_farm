import React from "react";
import { EmployeeCard } from "./employee/EmployeeCard";
import { Card, Spinner } from "flowbite-react";

interface EmployeeListProps {
  employees_list: Array<any>;
  isLoading: boolean;
}

const EmployeeList = ({ employees_list, isLoading }: EmployeeListProps) => {

  return (
    <Card className="max-w-sm m-5">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Employees
        </h5>
      </div>
      {isLoading && <Spinner aria-label="loading" />}
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {employees_list.map((employee, index) => (
            <EmployeeCard
              key={index}
              name={employee.name}
              phoneNumber={employee.phone}
              position={employee.position}
              picture={employee.picture}
            />
          ))}

          {/* Rest of the list items */}
        </ul>
      </div>
    </Card>
  );
};

export default EmployeeList;
