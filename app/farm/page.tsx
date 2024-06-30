// pages/index.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "firebase/firestore";
import {
  assignFarmToUser,
  createDocument,
  getDocFromFirestoreByValue,
  getDocument,
  readDataFromFirestoreByValue,
  updateRecord,
  updateRecordByField,
} from "../firebase/firestoreFunctions";
import { useForm } from "react-hook-form";
import Menu from "../components/Menu";
import FarmDetailsCard from "../components/FarmDetailsCard";
import { Button, Card, Toast } from "flowbite-react";
import { HiFire } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/config";
import { DocumentData, DocumentReference } from "firebase/firestore";

interface Farm {
  id: string;
  [key: string]: any;
}

interface Item {
  id: string;
  farm: Farm;
  [key: string]: any;
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

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToastt] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [isVisible, setVisible] = useState(true);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm();
  const name = watch("name");
  const phone = watch("phone");
  const [clickedCrops, setClickedCrops] = useState<string[]>([]);

  useEffect(() => {
    const userIdNonNull = user?.uid ?? "";
    if (userIdNonNull.length < 1) {
      //router.push("/");
    } else {
      const fetchData = async () => {
        setIsLoading(true);
        const items = (await readDataFromFirestoreByValue(
          "user",
          "userid",
          userIdNonNull
        )) as unknown as Item;
        if (items[0].farm) {
          const farmDocument = (await getDocument(
            items[0].farm as DocumentReference<unknown, DocumentData>
          )) as Farm | undefined; // Await the getDocument function call only if items[0].farm is not undefined
          if (farmDocument) {
            sessionStorage.setItem("farm_name", farmDocument.name);
            sessionStorage.setItem("farm_phone", farmDocument.phone);

            sessionStorage.setItem("farm_address", farmDocument.address);
            sessionStorage.setItem("visible", farmDocument.visible);
            sessionStorage.setItem("crops", farmDocument.crops);
            sessionStorage.setItem("farm_id", items[0].farm.id);
          }
          reset({
            name: sessionStorage.getItem("farm_name"),
            phone: sessionStorage.getItem("farm_phone"),
          });
          setFarmAddress(sessionStorage.getItem("farm_address") ?? "");
          if (sessionStorage.getItem("visible") === "true") {
            setVisible(true);
          }
          const cropsArray = JSON.parse(
            sessionStorage.getItem("crops")?.toString() ?? "[]"
          );

          setClickedCrops(cropsArray || []);
          setIsLoading(false);
        } else {
          console.log(`farm not found `);
        }
      };

      fetchData();
    }
  }, [user]);

  const saveLocation = async (lat: number, lng: number, address: string) => {
    setShowAlert(false);
    setLatitude(lat);
    setLongitude(lng);
    setFarmAddress(address);
  };

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
              latitude: latitude,
              longitude: longitude,
              visible: isVisible,
              crops: sessionStorage.getItem("crops"),
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
              crops: sessionStorage.getItem("crops"),
            },
            sessionStorage.getItem("farm_id") as string
          );
        }
      } else {
        const farm = await createDocument("farm", {
          name: name,
          phone: phone,
          address: farmAddress,
          latitude: latitude,
          longitude: longitude,
          visible: isVisible,
          crops: sessionStorage.getItem("crops"),
        });

        if (farm) {
          const farmRef = await getDocFromFirestoreByValue(
            "farm",
            farm.id ?? ""
          );

          //asign farm to user
          await assignFarmToUser(
            sessionStorage.getItem("userid") as string,
            farmRef
          );

          sessionStorage.setItem("farm_id", farm.id);
        } else {
          console.log("Farm not found");
        }
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
      <main
        className={`flex-on-desktop m-5 ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <FarmDetailsCard
          register={register}
          handleSubmit={handleSubmit}
          saveFarmDetails={saveFarmDetails}
          showAlert={showAlert}
          message={message}
          messageType={messageType}
          farmAddress={farmAddress}
          saveLocation={saveLocation}
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
                color={clickedCrops.includes(vegetable.name) ? "blue" : "light"}
                key={vegetable.id}
                className="rounded-full w-1/6 m-1"
                style={{ minWidth: "100px" }}
                onClick={() => saveCrops(vegetable.name)}
              >
                {vegetable.name}
              </Button>
            ))}
            {showToast && (
              <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
                  <HiFire className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">
                  Click save when you are done
                </div>
                <Toast.Toggle />
              </Toast>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
