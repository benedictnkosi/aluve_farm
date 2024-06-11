"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import { readDataFromFirestore } from "../firebase/firestoreFunctions";
import EmployeeList from "../components/Employees";

interface Item {
  id: string;
  [key: string]: any;
}


export default function Home() {
  const [user] = useAuthState(auth);
  const [employees, setEmployees] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      const items = await readDataFromFirestore("employee");
      setEmployees(items);
      setIsLoading(false);
    };
    fetchEmployees();

  }, []);


  console.log({ user });

  return (
    <div className="flex-on-desktop">
      <Menu/>
      <main className="flex-grow">
      <EmployeeList employees_list={employees} isLoading={isLoading} />
      
      </main>
    </div>
  );
}
