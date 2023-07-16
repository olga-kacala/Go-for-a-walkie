import React, { createContext, useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from '../../App';

export type AddPet = {
    id: number;
    name:string;
} 

export type Pet = {
    owner: string | null;
    id: number;
    name:string;
    dateOfBirth: Date | null;
    breed: string;
    sex: string;
    temper: string;  
}

export type AppContextState = {
    animals: Pet[];
    setPets: (param:[])=>void;
    username: string | null;
    setUsername: (username: string | null) => void;
    isLogged: boolean;
	setIsLogged: (param: boolean) => void;
    myPets: AddPet[];
	setMyPets: (animals: AddPet[]) => void;
    resultMyPets: string | null;
    setResultMyPets: (param: string) => void;
    myAnimalsList: Pet [];
    setmyAnimalsList: (animals: Pet[]) => void;
}

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppContext = createContext<AppContextState>({} as AppContextState);

export const AppProvider =({children}:AppProviderProps):JSX.Element => {
    const [animals, setPets]=useState([]);
    const [isLogged, setIsLogged]=useState(false);
    const [myPets, setMyPets]=useState([] as AddPet[]);
    const [username, setUsername] = useState<string | null>('');
    const [ resultMyPets, setResultMyPets] = useState('');
    const [myAnimalsList, setmyAnimalsList] = useState([] as Pet[]);

    useEffect(()=>{
        if(myAnimalsList.length===0){
            setResultMyPets("Your list of pets is empty.");
        } else {
            setResultMyPets("Your pet list:")
        }
    },[myAnimalsList])

    
    return (
       <AppContext.Provider
       value={{
        username,
        setUsername,
        isLogged,
        setIsLogged,
        myPets,
        setMyPets,
        animals,
        setPets,
        resultMyPets,
        setResultMyPets,
        myAnimalsList,
        setmyAnimalsList,
       }}>
        {children}
       </AppContext.Provider> 
    )
}





