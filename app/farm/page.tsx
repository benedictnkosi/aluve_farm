// pages/index.tsx
"use client";
import { useEffect, useState } from "react";

import "firebase/firestore";
import { assignFarmToUser, createDocument, readDataFromFirestoreByValue, updateRecord, updateRecordByField } from "../firebase/firestoreFunctions";
import { useForm } from "react-hook-form";
import Menu from "../components/Menu";
import FarmDetailsCard from "../components/FarmDetailsCard";
import { Button, Card, Toast } from "flowbite-react";
import { HiFire } from "react-icons/hi";



interface ButtonData {
  id: number;
  name: string;
}

const jsonData = {
  vegetables: [
    {
      name: "Apple",
      id: "fruit_1",
    },
    {
      name: "Apricot",
      id: "fruit_19",
    },
    {
      name: "Avocado",
      id: "fruit_11",
    },
    {
      name: "Banana",
      id: "fruit_2",
    },
    {
      name: "Beetroot",
      id: "vegetable_14",
    },
    {
      name: "Broccoli",
      id: "vegetable_8",
    },
    {
      name: "Butternut",
      id: "vegetable_19",
    },
    {
      name: "Cabbage",
      id: "vegetable_3",
    },
    {
      name: "Carrot",
      id: "vegetable_1",
    },
    {
      name: "Cauliflower",
      id: "vegetable_9",
    },
    {
      name: "Cucumber",
      id: "vegetable_16",
    },
    {
      name: "Eggplant",
      id: "vegetable_17",
    },
    {
      name: "Fig",
      id: "fruit_17",
    },
    {
      name: "Grapes",
      id: "fruit_7",
    },
    {
      name: "Green Beans",
      id: "vegetable_7",
    },
    {
      name: "Guava",
      id: "fruit_16",
    },
    {
      name: "Kiwi",
      id: "fruit_15",
    },
    {
      name: "Lemon",
      id: "fruit_10",
    },
    {
      name: "Lettuce",
      id: "vegetable_13",
    },
    {
      name: "Mango",
      id: "fruit_4",
    },
    {
      name: "Mushroom",
      id: "vegetable_20",
    },
    {
      name: "Onion",
      id: "vegetable_12",
    },
    {
      name: "Orange",
      id: "fruit_3",
    },
    {
      name: "Papaya",
      id: "fruit_6",
    },
    {
      name: "Passion Fruit",
      id: "fruit_18",
    },
    {
      name: "Peach",
      id: "fruit_13",
    },
    {
      name: "Pear",
      id: "fruit_12",
    },
    {
      name: "Pepper",
      id: "vegetable_10",
    },
    {
      name: "Pineapple",
      id: "fruit_5",
    },
    {
      name: "Plum",
      id: "fruit_14",
    },
    {
      name: "Potato",
      id: "vegetable_2",
    },
    {
      name: "Pumpkin",
      id: "vegetable_5",
    },
    {
      name: "Radish",
      id: "vegetable_15",
    },
    {
      name: "Spinach",
      id: "vegetable_4",
    },
    {
      name: "Strawberry",
      id: "fruit_8",
    },
    {
      name: "Sweet Potato",
      id: "vegetable_6",
    },
    {
      name: "Tomato",
      id: "vegetable_11",
    },
    {
      name: "Watermelon",
      id: "fruit_9",
    },
    {
      name: "Zucchini",
      id: "vegetable_18",
    },
  ],
};

const Home: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToastt] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [isVisible, setVisible] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm();
  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const name = watch("name");
   const phone = watch("phone");
  const [clickedCrops, setClickedCrops] = useState<string[]>([]);

  useEffect(() => {
    reset({ name: sessionStorage.getItem("farm_name"), phone: sessionStorage.getItem("farm_phone")});
    
    setFarmAddress(sessionStorage.getItem("farm_address") ?? "");
    if (sessionStorage.getItem("visible") === "true") {
      setVisible(true);
    }

    const cropsArray = JSON.parse(
      sessionStorage.getItem("crops")?.toString() ?? "[]"
    );
    
    setClickedCrops(cropsArray);
  }, []);

  const findLocation = async () => {
    setShowAlert(false);
    
    try {
      const position = await getDeviceLocation();
      const lat = (position as GeolocationPosition).coords.latitude;
      const lng = (position as GeolocationPosition).coords.longitude;
      setLatitude(lat.toString());
      setLongitude(lng.toString());

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      const suburb = data.results[0].address_components.find(
        (item: { types: string | string[] }) =>
          item.types.includes("sublocality")
      ).long_name;
      const town = data.results[0].address_components.find(
        (item: { types: string | string[] }) =>
          item.types.includes("locality")
      ).long_name;
      const province = data.results[0].address_components.find(
        (item: { types: string | string[] }) =>
          item.types.includes("administrative_area_level_1")
      ).long_name;

      setFarmAddress(`${suburb}, ${town}, ${province}`);

    } catch (error) {
      setMessage(
        "Failed to get location, enable location services and try again"
      );
      setMessageType("error");
      setShowAlert(true);
    }
  };

  
  function getDeviceLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }


  const saveFarmDetails = async () => {    
    try {
      setIsLoading(true);
      setShowAlert(false);
      if (sessionStorage.getItem("farm_id")) {
        if (latitude) {
            await updateRecord(
              "farm",
              {
              name: name,
              phone: phone,
              address: farmAddress,
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              visible: isVisible,
              crops: sessionStorage.getItem("crops")
              },
              sessionStorage.getItem("farm_id") as string
            );
          sessionStorage.setItem("farm_address", farmAddress);
        } else {
          await updateRecord(
            "farm",
            {
              name: name,
              phone: phone,
              visible: isVisible,
              crops:sessionStorage.getItem("crops")
            },
            sessionStorage.getItem("farm_id") as string
          );
        }
      } else {
       const farm =  await createDocument("farm", {
          name: name,
          phone: phone,
          address: farmAddress,
          latitude: latitude,
          longitude: longitude,
          visible: isVisible,
          crops:sessionStorage.getItem("crops")
        });

        //asign farm to user
        await assignFarmToUser(
          sessionStorage.getItem("userid") as string,
          farm
        );

        sessionStorage.setItem("farm_id", farm.id);
      }

      sessionStorage.setItem("farm_name", name);
      sessionStorage.setItem("farm_phone", phone);
      setMessage("Farm details saved successfully");
      setMessageType("success");
      setShowAlert(true);
      setIsLoading(false);
    } catch (error) {
      setMessage("Failed to save farm details");
      setMessageType("error");
      setShowAlert(true);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisible(event.target.checked);
    sessionStorage.setItem("visible", event.target.checked.toString());
  };

  useEffect(() => {
    if (clickedCrops.length > 0) {
      sessionStorage.setItem("crops", JSON.stringify(clickedCrops));
    }
    
  }, [clickedCrops]);


  const saveCrops = async (name: string) => {
    setClickedCrops((prevState) => {
      if (prevState.includes(name)) {
        return prevState.filter((buttonName) => buttonName !== name);
      } else {
        return [...prevState, name];
      }
    });

    setShowToastt(true);
    setTimeout(() => {
      setShowToastt(false);
    }, 5000);
  
  };


  
  return (
    <div className="flex-on-desktop">
      <Menu />
      <main className="flex-on-desktop m-5">
        <FarmDetailsCard
          register={register}
          handleSubmit={handleSubmit}
          saveFarmDetails={saveFarmDetails}
          showAlert={showAlert}
          message={message}
          messageType={messageType}
          farmAddress={farmAddress}
          findLocation={findLocation}
          isLoading={isLoading}
          isVisible={isVisible}
          handleCheckboxChange={handleCheckboxChange}
          style={{ minWidth: "300px" }}
        />

        <Card className="">
        
        
        
          <p className="flex justify-center mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-3xl">
            What are you growing?
          </p>

          <div className="flex flex-row flex-wrap justify-center">
            {" "}
            {jsonData.vegetables.map((vegetable) => (
              <Button
                color={
                  clickedCrops.includes(vegetable.name) ? "blue" : "light"
                }
                key={vegetable.id}
                className="rounded-full w-1/6 m-1"
                style={{ minWidth: "100px" }}
                onClick={() => saveCrops(vegetable.name)}
              >
                {vegetable.name}
              </Button>
            ))}

{showToast &&<Toast>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
            <HiFire className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            Click save when you are done
          </div>
          <Toast.Toggle />
        </Toast>}


          </div>
        </Card>
      </main>
    </div>
  );
};

export default Home;
