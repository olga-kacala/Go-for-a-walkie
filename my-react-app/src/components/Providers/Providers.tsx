import { createContext, useState } from "react";

export type AddPet = {
    id: string;
    name:string;
    age: number;
    breed: string;
} 

type AppContextState = {
    username: string | null;
    setUsername: (username: string | null) => void;
    isLogged: boolean;
	setIsLogged: (param: boolean) => void;
    myPets: AddPet[];
	setMyPets: (pets: AddPet[]) => void;
}

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppContext = createContext<AppContextState>({}as AppContextState);

export const AppProvider =({children}:AppProviderProps):JSX.Element => {
    const [isLogged, setIsLogged]=useState(false);
    const [myPets, setMyPets]=useState([] as AddPet[]);
    const [username, setUsername] = useState<string | null>("");
    return (
       <AppContext.Provider
       value={{
        username,
        setUsername,
        isLogged,
        setIsLogged,
        myPets,
        setMyPets
       }}>
        {children}
       </AppContext.Provider> 
    )
}





