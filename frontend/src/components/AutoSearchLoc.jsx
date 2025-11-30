import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import CancelIcon from "@mui/icons-material/Cancel";
import { Tooltip } from "@mui/material";
import useDebounce from "./utility/useDebounce";

import styled from "styled-components";

const Input = styled.input`
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const AutoCompleteBox = ({setFetchedAdd, onChange, value }) => {

  const [predictionsArray, setPredictions] = useState([]);
  const [queryPlace, setQueryPlace] = useState("");

  const searchQuery = useDebounce(queryPlace, 800);



  useEffect(() => {
    if (searchQuery.trim() !== "") {
      // console.log(searchQuery);
      // Get AutocompleteService from window object
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();
      // Use AutocompleteService to get predictions based on input
      autocompleteService.getPlacePredictions(
        { input: searchQuery, componentRestrictions: { country: "CA" } },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(predictions);
          }
        }
      );
    } else if (searchQuery.trim() === "") {
      setPredictions([]);
    }
  }, [searchQuery]);


  // * function running on key down and returning predictions based on input
  const handleAutocompleteChange = (text) => {
    const inputText = text;
    setQueryPlace(inputText);
  };

  // * function returning selected place details
  const handlePlaceSelect = (place) => {
    console.log(place);
    setQueryPlace(place.description);
    const placeService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    setFetchedAdd(place.description)
    onChange({ ...value, address: place.description })

    // placeService.getDetails(
    //   { placeId: place.place_id },
    //   (placeResult, status) => {
    //     if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //       let lat = placeResult.geometry.location.lat();
    //       let lng = placeResult.geometry.location.lng();

    //       setPredictions([]);
    //       setQueryPlace("");
    //     }
    //   }
    // );
  };

  const handleClearInput = () => {
    setQueryPlace("");
    setPredictions("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryPlace.trim() !== "") {
      // Get AutocompleteService from window object
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();
      // Use AutocompleteService to get predictions based on input
      autocompleteService.getPlacePredictions(
        { input: queryPlace, componentRestrictions: { country: "CA" } },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(predictions);
          }
        }
      );
    } else if (queryPlace.trim() === "") {
      setPredictions([]);
    }
  };

  return (
    <>
      <div className="w-full">
        <form className="relative" onSubmit={handleSubmit}>
          {/* <div className="flex items-center justify-between gap-x-2 hover:outline outline-1 outline-gray-500 bg-white shadow-md text-sm rounded-lg w-full px-4 py-2"> */}
            <Input
              type="text"
              value={queryPlace}
              className="outline-none w-full"
              placeholder="Search for area, street name..."
              onChange={(e) => handleAutocompleteChange(e.target.value)}
            />
            {queryPlace.length !== 0 && (
              <Tooltip
                placement="right"
                title="clear"
                arrow
                className="text-gray-300"
              >
                <CancelIcon
                  fontSize="small"
                  className="cursor-pointer absolute top-9 right-5"
                  onClick={handleClearInput}
                />
              </Tooltip>
            )}
          {/* </div> */}
        </form>

        {predictionsArray?.length > 0 && (
          <div className="max-h-[15rem] w-full absolute overflow-auto bg-white border rounded-md">
            <ul className="w-full text-sm text-gray-700 dark:text-gray-200 flex flex-col items-center justify-center">
              {predictionsArray &&
                predictionsArray.map((item) => (
                  <li
                    key={item.place_id}
                    className="text-left w-full p-2 border-b text-gray-700 hover:cursor-pointer hover:bg-orange-500 hover:text-white "
                    onClick={() => handlePlaceSelect(item)}
                  >
                    {item.description}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default AutoCompleteBox;
