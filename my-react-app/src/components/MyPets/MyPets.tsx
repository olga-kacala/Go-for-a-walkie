import { useContext, useState } from "react";
import { AppContext } from "../Providers/Providers";
import { AddPet } from "../Providers/Providers";
import classes from './MyPets.module.css';

type MyPetsProps = {
    myPets: AddPet[];
};

export function MyPets ({myPets}:MyPetsProps):JSX.Element {
    const {resultMyPets} = useContext(AppContext);
    const [petName, setPetName] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmitPet = async (e:React.FormEvent): Promise<void>=> {
        e.preventDefault();
        console.log(petName)
    }
    return (
        <div className={classes.login}>
        <h2>My Pets</h2>
        <h2>{resultMyPets}</h2>
        <form>
          <input
            name="pet name"
            type="pet name"
            value={petName}
            placeholder="Pet name"
            required
            onChange={(e) => {
              setPetName(e.target.value);
            }}
          />
          
          <p>{error}</p>
          <button className={classes.button} onClick={handleSubmitPet}>
            Add Pet
          </button>
        </form>
        </div>
    )
}