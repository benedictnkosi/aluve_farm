"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import Menu from "./components/Menu";
import Dashboard from "./components/Dashboard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "firebase/firestore";
import {
  getDocument,
  getVisibleFarmsWithCrop,
  readDataFromFirestoreByValue,
} from "./firebase/firestoreFunctions";
import FarmersMap from "./components/FarmersMap";
import { Button, Dropdown, Navbar } from "flowbite-react";

interface Farm {
  id: string;
  [key: string]: any;
}

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [markers, setMarkers] = useState([]);
  const [filterCropsArray, setFilterCrops] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState("Filter By Crop");

  let filterCrops: string[] = [];

  const fetchData = async () => {
    const farms = (await getVisibleFarmsWithCrop(
      selectedCrop
    )) as unknown as Farm;

    farms.forEach((farm: Farm) => {
      console.log(farm.name);
      const cropsArray = JSON.parse(farm.crops);
      console.log(cropsArray);
      // Add your logic here for each crop in cropsArray
      
      cropsArray.forEach((crop: string) => {
        console.log(crop);
        // Add your logic here for each crop
        if (!filterCrops.includes(crop) && selectedCrop == "Filter By Crop") {
          filterCrops.push(crop);
          setFilterCrops(filterCrops);
        }
      });

      if (farm.latitude.length !== 0) {
        const updatedMarkers = farms
          .filter((farm: Farm) => farm.latitude.length !== 0 && farm.crops)
          .map((farm: Farm) => {
            return {
              id: farm.id,
              position: { lat: farm.latitude, lng: farm.longitude },
              label: farm.name,
              address: farm.address,
              phone: farm.phone,
              crops: farm.crops
          .replace(/","/g, ", ")
          .replace(/"/g, "")
          .replace("[", "")
          .replace("]", ""),
            };
          });
        setMarkers(updatedMarkers);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [selectedCrop, router]);

  return (
    <div>
      <Navbar fluid rounded>
        <Navbar.Brand href="/">
          <img
            src="/logo-clear.png"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Agri Community
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <div className="mr-2">
            <Dropdown label={selectedCrop}>
              {filterCropsArray.map((crop, index) => (
                <Dropdown.Item onClick={() => {
                  setSelectedCrop(crop);
                  fetchData();
                }} key={index}>{crop}</Dropdown.Item>
              ))}
            </Dropdown>
          </div>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="/sign-in">Login</Navbar.Link>
          <Navbar.Link href="/sign-up">Register</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <main className="flex-grow w-full h-full">
        <FarmersMap markers={markers} />
      </main>
    </div>
  );
}
