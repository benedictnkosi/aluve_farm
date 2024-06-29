"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import {
  createDocument,
  getDocFromFirestoreByValue,
  readDataFromFirestore,
  readDataFromFirestoreByValue,
} from "../firebase/firestoreFunctions";
import BatchList from "../components/Batches";
import {
  Button,
  Card,
  Datepicker,
  Dropdown,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import { set } from "firebase/database";
import Alert from "../components/Alert";

interface Item {
  id: string;
  [key: string]: any;
}

export default function Home() {
  const [user] = useAuthState(auth);
  const [batches, setBatches] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Filter By Crop");
  const [batchSelectedCrop, setBatchSelectedCrop] = useState("Select Crop");
  const [filterCropsArray, setFilterCrops] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState(new Date());
  const [crops, setCrops] = useState<Item[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function onCloseModal() {
    setOpenModal(false);
    setQuantity(0);
    setDate(new Date());
    fetchBatches();
  }

  const fetchBatches = async () => {
    setIsLoading(true);
    if (selectedCrop === "Filter By Crop") {
      const items = await readDataFromFirestore("batch");
      setBatches(items);
      setIsLoading(false);
      return;
    } else {
      const items = await readDataFromFirestoreByValue(
        "batch",
        "crop_name",
        selectedCrop
      );
      setBatches(items);
      setIsLoading(false);
    }
  };

  const fetchCropNames = async () => {
    setIsLoading(true);
    const items = await readDataFromFirestore("crop");
    setCrops(items);
    const cropNames = items.map((item: any) => item.name);
    setFilterCrops(cropNames);
  };

  useEffect(() => {
    fetchBatches();
    fetchCropNames();
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [selectedCrop]);

  console.log({ user });

  async function createbatch(): Promise<void> {
    setIsLoading(true);
    try {
      if (quantity !== 0 && batchSelectedCrop !== "Select Crop") {
        const name = `${batchSelectedCrop}-${
          date.getMonth() + 1
        }-${date.getDate()}`;

        const selectedCrop = crops.find(
          (crop) => crop.name === batchSelectedCrop
        );

        const id = selectedCrop?.id || "";

        if (selectedCrop) {
          const transplantDate = new Date(date);
          transplantDate.setDate(
            transplantDate.getDate() + parseInt(selectedCrop.Seedling_days)
          );

          const harvestDate = new Date(transplantDate);
          harvestDate.setDate(
            harvestDate.getDate() + parseInt(selectedCrop.plant_days)
          );

          const selectedCropRef = await getDocFromFirestoreByValue("crop", id);

          createDocument("batch", {
            crop: selectedCropRef,
            crop_name: selectedCrop?.name,
            seedling_date: date,
            name: name,
            seedling_quantity: quantity,
            transplant_date: transplantDate,
            harvest_date: harvestDate,
          });

          setMessage("Batch created successfully");
          setMessageType("success");
          setShowAlert(true);
          setIsLoading(false);
        } else {
          setMessage("Failed to create batch");
          setMessageType("error");
          setShowAlert(true);
        }
      } else {
        setMessage("Please select a crop and enter a quantity");
        setMessageType("error");
        setShowAlert(true);
      }
    } catch (error) {
      setMessage("Failed to create batch");
      setMessageType("error");
      setShowAlert(true);
    }
  }

  return (
    <div className="flex-on-desktop">
      <Menu />
      <main className="flex-grow">
        <Card className="m-5">
          <div className="flex flex-wrap">
            <div className="m-5"><Dropdown label={selectedCrop}>
              {filterCropsArray.map((crop, index) => (
                <Dropdown.Item
                  onClick={() => {
                    setSelectedCrop(crop);
                  }}
                  key={index}
                >
                  {crop}
                </Dropdown.Item>
              ))}
            </Dropdown></div>
            
                  <div className="m-5"><Button
              onClick={() => {
                setOpenModal(true);
              }}
            >
              New Batch
            </Button></div>
            
            </div>
        </Card>

        <Modal show={openModal} size="md" onClose={onCloseModal} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Create New Batch
              </h3>

              {showAlert && <Alert message={message} type={messageType} />}

              <div>
                <Dropdown label={batchSelectedCrop}>
                  {filterCropsArray.map((crop, index) => (
                    <Dropdown.Item
                      onClick={() => {
                        setBatchSelectedCrop(crop);
                      }}
                      key={index}
                    >
                      {crop}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="date" value="Seedling Date" />
                </div>
                <Datepicker
                  id="date"
                  onSelectedDateChanged={(newDate) => setDate(newDate)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="quantity" value="Quantity" />
                </div>
                <TextInput
                  id="quantity"
                  type="quantity"
                  required
                  onChange={(event) => setQuantity(Number(event.target.value))}
                />
              </div>

              <div className="w-full">
                <Button onClick={createbatch}>Create Batch</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {isLoading ? null : (
          <BatchList batch_list={batches} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}
