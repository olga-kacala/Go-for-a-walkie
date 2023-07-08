import React, { createContext, useEffect, useState } from 'react';
import { useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from '../../App';

export type AddPet = {
    id: string;
    name:string;
} 

export type Pet = {
    id: string;
    name:string;
    age: number;
    breed: string;
    sex: string;  
}

export type AppContextState = {
    pets: Pet[];
    setPets: (param:[])=>void;
    username: string | null;
    setUsername: (username: string | null) => void;
    isLogged: boolean;
	setIsLogged: (param: boolean) => void;
    myPets: AddPet[];
	setMyPets: (pets: AddPet[]) => void;
    resultMyPets: string | null;
    setResultMyPets: (param: string) => void;
}

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppContext = createContext<AppContextState>({}as AppContextState);

export const AppProvider =({children}:AppProviderProps):JSX.Element => {
    const [pets, setPets]=useState([]);
    const [isLogged, setIsLogged]=useState(false);
    const [myPets, setMyPets]=useState([] as AddPet[]);
    const [username, setUsername] = useState<string | null>("nazwa");
    const [ resultMyPets, setResultMyPets] = useState('');
    return (
       <AppContext.Provider
       value={{
        username,
        setUsername,
        isLogged,
        setIsLogged,
        myPets,
        setMyPets,
        pets,
        setPets,
        resultMyPets,
        setResultMyPets
       }}>
        {children}
       </AppContext.Provider> 
    )
}





