import { useContext } from "react";
import { AppContext } from "../Providers/Providers";
import { AddPet } from "../Providers/Providers";

type MyPetsProps = {
    myPets: AddPet[];
};

export function MyPets ({myPets}:MyPetsProps):JSX.Element {
    const {resultMyPets} = useContext(AppContext);
    return (
        <div>
        <h1>My Pets</h1>
        <h2>{resultMyPets}</h2>
        </div>
    )
}