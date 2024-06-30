"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import {
  createDocument,
  getByRefAndValue,
  getDocFromFirestoreByValue,
  readDataFromFirestore,
  readDataFromFirestoreByValue,
  updateRecord,
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
import { updateDoc } from "firebase/firestore";

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
  const [openTransplantModal, setOpenTransplantModal] = useState(false);
  const [selectedTransplantHarvestCrop, setSelectedTransplantHarvestCrop] =
    useState("");
  const [selectedHarvestUnits, setSelectedHarvestUnits] = useState("");
  const [quantityLabelText, setQuantityLabelText] = useState("");
  const [modalTransplantHarvestHeader, setModalTransplantHarvestHeader] =
    useState("");
  const [transplantArray, setTransplantArray] = useState<
    { quantity: number; date: Date }[]
  >([]);
  const [harvestArray, setHarvestArray] = useState<
    { quantity: number; date: Date }[]
  >([]);
  const [selectedUpdateBatchID, setSelectedUpdateBatchID] = useState("");

  function onCloseModal() {
    setOpenModal(false);
    setOpenTransplantModal(false);
    setQuantity(0);
    setDate(new Date());
    fetchBatches();
  }

  function handleTransplantLinkClick(
    id: string,
    selectedBatch: string,
    transplantArray: Array<any>
  ) {
    setOpenTransplantModal(true);
    setSelectedTransplantHarvestCrop(selectedBatch);
    setQuantityLabelText("How many seedlings transplanted");
    setModalTransplantHarvestHeader(`Transplant ${selectedBatch}`);
    setTransplantArray(transplantArray);
    setSelectedUpdateBatchID(id);
  }

  function handleHarvestLinkClick(
    id: string,
    selectedBatch: string,
    selectedHarvestUnits: string,
    harvestArray: Array<any>
  ) {
    setOpenTransplantModal(true);
    setSelectedTransplantHarvestCrop(selectedBatch);
    setSelectedHarvestUnits(selectedHarvestUnits);
    setQuantityLabelText(`How many ${selectedHarvestUnits} harvested`);
    setModalTransplantHarvestHeader(`Harvest ${selectedBatch}`);
    setHarvestArray(harvestArray);
    setSelectedUpdateBatchID(id);
  }

  const fetchBatches = async () => {
    setIsLoading(true);
    const farmRef = await getDocFromFirestoreByValue("farm", sessionStorage.getItem("farm_id") ?? "");
    if (selectedCrop === "Filter By Crop") {
      const items = await getByRefAndValue("batch", "farm", farmRef,"","");
      setBatches(items);
      setIsLoading(false);
      return;
    } else {
      const items = await getByRefAndValue("batch", "farm", farmRef,"crop_name",selectedCrop);
      setBatches(items);
      setIsLoading(false);
    }
  };

  const fetchCropNames = async () => {
    setIsLoading(true);
    const farmRef = await getDocFromFirestoreByValue("farm", sessionStorage.getItem("farm_id") ?? "");
    const items = await getByRefAndValue("crop", "farm", farmRef,"","");
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
        const month = date.toLocaleString("default", { month: "short" });

        const name = `${batchSelectedCrop}-${month}-${date.getDate()}`;

        const selectedCrop = crops.find(
          (crop) => crop.name === batchSelectedCrop
        );

        const id = selectedCrop?.id || "";
        const harvestUnits = selectedCrop?.harvest_units || "";

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
          const farmRef = await getDocFromFirestoreByValue("farm", sessionStorage.getItem("farm_id") ?? "");

          createDocument("batch", {
            farm: farmRef,
            crop: selectedCropRef,
            crop_name: selectedCrop?.name,
            seedling_date: date,
            name: name,
            seedling_quantity: quantity,
            transplant: [
              {
                date: harvestDate,
              },
            ],
            harvest: [
              {
                date: harvestDate,
              },
            ],
            harvest_units: harvestUnits,
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

  async function updateBatch(): Promise<void> {
    setIsLoading(true);
    try {
      if (quantity !== 0 && !isNaN(date.getTime())) {
        if (selectedCrop) {
          if (modalTransplantHarvestHeader.includes("Transplant")) {
            const containsQuantity = transplantArray.some(
              (item) => item.quantity !== undefined && item.quantity !== null
            );
            if (containsQuantity) {
              transplantArray.push({
                date: date,
                quantity: quantity,
              });
            } else {
              transplantArray.pop();
              transplantArray.push({
                date: date,
                quantity: quantity,
              });
            }

            await updateRecord(
              "batch",
              { transplant: transplantArray },
              selectedUpdateBatchID
            );
          }else{
            const containsQuantity = harvestArray.some(
              (item) => item.quantity !== undefined && item.quantity !== null
            );
            if (containsQuantity) {
              harvestArray.push({
                date: date,
                quantity: quantity,
              });
            } else {
              harvestArray.pop();
              harvestArray.push({
                date: date,
                quantity: quantity,
              });
            }

            await updateRecord(
              "batch",
              { harvest: harvestArray },
              selectedUpdateBatchID
            );
          }

          setMessage("Batch updated successfully");
          setMessageType("success");
          setShowAlert(true);
          setIsLoading(false);
        } else {
          setMessage("Failed to update batch");
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
            <div className="m-5">
              <Dropdown label={selectedCrop}>
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
              </Dropdown>
            </div>

            <div className="m-5">
              <Button
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                New Batch
              </Button>
            </div>
          </div>
        </Card>

        <Modal
          show={openModal}
          size="md"
          onClose={onCloseModal}
          popup
          id="new_batch"
        >
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
        <Modal
          show={openTransplantModal}
          size="md"
          onClose={onCloseModal}
          popup
          id="transplant"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {modalTransplantHarvestHeader}
              </h3>

              {showAlert && <Alert message={message} type={messageType} />}

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="date" value="Date" />
                </div>
                <Datepicker
                  id="date"
                  onSelectedDateChanged={(newDate) => setDate(newDate)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="quantity" value={quantityLabelText} />
                </div>
                <TextInput
                  id="quantity"
                  type="quantity"
                  required
                  onChange={(event) => setQuantity(Number(event.target.value))}
                />
              </div>

              <div className="w-full">
                <Button onClick={updateBatch}>Submit</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {isLoading ? null : (
          <BatchList
            batch_list={batches}
            isLoading={isLoading}
            transplantFunction={handleTransplantLinkClick}
            harvestFunction={handleHarvestLinkClick}
          />
        )}
      </main>
    </div>
  );
}
