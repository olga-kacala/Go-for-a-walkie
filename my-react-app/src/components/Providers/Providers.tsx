import React, { createContext, useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../App";

// export type AddPet = {
//   id: number;
//   name: string;
// };

export type Pet = {
  owner: string | null;
  id: number;
  name: string;
  dateOfBirth: Date | null;
  breed: string;
  sex: string;
  temper: string;
};

export type AppContextState = {
  animals: Pet[];
  setPets: (param: []) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  isLogged: boolean;
  setIsLogged: (param: boolean) => void;
//   myPets: AddPet[];
//   setMyPets: (animals: AddPet[]) => void;
  resultMyPets: string | null;
  setResultMyPets: (param: string) => void;
  myAnimalsList: Pet[];
  setmyAnimalsList: (animals: Pet[]) => void;
  removeFromList: (petId: number) => void;
  addToList: (product: Pet) => void;
  petName: string | null;
  setPetName: (param: string) => void;
  breed: string | null;
  setBreed: (param: string) => void;
  selectedSex: string | null;
  setSelectedSex: (param: string) => void;
  selectedTemper: string | null;
  setSelectedTemper: (param: string) => void;
  error: string | null;
  setError: (param: string) => void;
  dateOfBirth: Date | null;
  setDateOfBirth: (param: Date) => void;
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<AppContextState>({} as AppContextState);

export const AppProvider = ({ children }: AppProviderProps): JSX.Element => {
  const [animals, setPets] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
//   const [myPets, setMyPets] = useState([] as AddPet[]);
  const [username, setUsername] = useState<string | null>("");
  const [resultMyPets, setResultMyPets] = useState("");
  const [myAnimalsList, setmyAnimalsList] = useState([] as Pet[]);
  const [petName, setPetName] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [selectedSex, setSelectedSex] = useState<string>("");
  const [selectedTemper, setSelectedTemper] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const addToList = async (product: Pet): Promise<void> => {
    try {
      await setDoc(doc(firebaseDb, "MyPets", `${username}`), {
        animals: [...myAnimalsList, product],
      });
      setmyAnimalsList([...myAnimalsList, product]);
      setPetName("");
      setDateOfBirth(null);
      setBreed("");
      setSelectedSex("");
      setSelectedTemper("");
      setError("");
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromList = async (petId: number): Promise<void> => {
    const newArr = myAnimalsList.filter((obj) => obj.id !== petId);
    try {
      await setDoc(doc(firebaseDb, "MyPets", `${username}`), {
        animals: newArr,
      });
      setmyAnimalsList(newArr);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (myAnimalsList.length === 0) {
      setResultMyPets("Your list of pets is empty.");
    } else {
      setResultMyPets("Your pet list:");
    }
  }, [myAnimalsList]);

  return (
    <AppContext.Provider
      value={{
        username,
        setUsername,
        isLogged,
        setIsLogged,
        // myPets,
        // setMyPets,
        animals,
        setPets,
        resultMyPets,
        setResultMyPets,
        myAnimalsList,
        setmyAnimalsList,
        removeFromList,
        addToList,
        petName,
        breed,
        selectedSex,
        selectedTemper,
        error,
        dateOfBirth,
        setPetName,
        setDateOfBirth,
        setBreed,
        setSelectedSex,
        setSelectedTemper,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
