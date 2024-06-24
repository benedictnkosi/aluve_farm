import React, { FormEvent } from "react";
import { Button, Card, Checkbox, Label, Spinner, Toast } from "flowbite-react";
import Alert from "./Alert";
import Autocomplete from "react-google-autocomplete";

interface FarmDetailsCardProps {
  register: any; // replace with the correct type
  handleSubmit: (
    callback: (data: any) => void
  ) => (e?: FormEvent) => Promise<void>;
  saveFarmDetails: (data: any) => void; // replace with the correct type
  showAlert: boolean;
  message: string;
  messageType: string; // if this can only be a few specific strings, consider using a string literal type
  farmAddress: string; // assuming farmAddress is a string
  saveLocation: (lat: number, long: number, address: string) => void; // assuming findLocation is a function that takes no arguments and returns nothing
  isLoading: boolean;
  isVisible: boolean;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

const FarmDetailsCard: React.FC<FarmDetailsCardProps> = ({
  register,
  handleSubmit,
  saveFarmDetails,
  showAlert,
  message,
  messageType,
  farmAddress,
  saveLocation,
  isLoading,
  isVisible,
  handleCheckboxChange,
  style,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY?.toString() || "";
  return (
    <Card style={style}>
      <form
        className="flex max-w-md flex-col gap-4"
        onSubmit={handleSubmit(saveFarmDetails)}
      >
        {showAlert && <Alert message={message} type={messageType} />}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="farmName" value="Farm Name" />
          </div>

          <input
            type="string"
            {...register("name", {
              required: "Name is required",
            })}
            className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="phone" value="Phone Number" />
          </div>

          <input
            type="string"
            {...register("phone", {
              required: "Phone is required",
            })}
            className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="address" value={farmAddress ?? ""} />
          </div>
        </div>
        <div>
          <Autocomplete
            className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            apiKey={apiKey}
            onPlaceSelected={(place) => {
              console.log(place);
              if (place.geometry && place.geometry.location) {
                console.log(place.geometry.location.lat());
                console.log(place.geometry.location.lng());
                const address = place.address_components?.map((component) => component.long_name).join(", ") || "";
                console.log(address);

                saveLocation(
                  place.geometry.location.lat(),
                  place.geometry.location.lng(),
                  address,
                );
              }
            }}
            options={{
              types: ["(regions)"],
              componentRestrictions: { country: "za" },
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="accept"
            onChange={handleCheckboxChange}
            checked={isVisible}
          />

          <Label htmlFor="accept" className="flex">
            Show my farm on the map
          </Label>
        </div>
        ø
        <Button type="submit">
          {!isLoading && <span>Save</span>}
          {isLoading && <Spinner aria-label="Saving" />}
        </Button>
      </form>
    </Card>
  );
};

export default FarmDetailsCard;
