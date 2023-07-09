import { useContext, useState } from "react";
import { AppContext } from "../Providers/Providers";
import { AddPet } from "../Providers/Providers";
import classes from "./MyPets.module.css";

type MyPetsProps = {
  myPets: AddPet[];
};

export function MyPets({ myPets }: MyPetsProps): JSX.Element {
  const { resultMyPets } = useContext(AppContext);
  const [petName, setPetName] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [breed, setBreed] = useState<string>("");
  const [selectedSex, setSelectedSex] = useState<string>("");
  const [selectedTemper, setSelectedTemper] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmitPet = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
  };
  return (
    <div className={classes.login}>
      <h2>My Pets</h2>
      <h2>{resultMyPets}</h2>
      <form className={classes.input}>
        <input
          name="pet name"
          type="string"
          value={petName}
          placeholder="Pet name"
          required
          onChange={(e) => {
            setPetName(e.target.value);
          }}
        />
        <input
          name="age"
          type="number"
          value={age ?? ""}
          placeholder="Age (years)"
          required
          onChange={(e) => {
            setAge(Number(e.target.value));
          }}
        />
        <input
          name="breed"
          type="string"
          value={breed}
          placeholder="Breed"
          required
          onChange={(e) => {
            setBreed(e.target.value);
          }}
        />
        <select
          id="picklist"
          value={selectedSex}
          onChange={(e) => {
            setSelectedSex(e.target.value);
          }}
        >
          <option value="">Select sex</option>
          <option value="female">Female&#9792;</option>
          <option value="male">Male&#9794;</option>
        </select>
        <select
          id="picklist"
          value={selectedTemper}
          onChange={(e) => {
            setSelectedTemper(e.target.value);
          }}
        >
          <option value="">Select temper</option>
          <option value="tiger">
            &#x1F405; Tiger - powerful bodie and hyper active individual
          </option>
          <option value="sloth">
            &#x1F9A5; Sloth - slow-motion lifestyle and charming appearances
          </option>
          <option value="octopus">
            &#x1F419; Octopus - shy and secretive behavior
          </option>
        </select>

        <p>{error}</p>
        <button className={classes.button} onClick={handleSubmitPet}>
          Add Pet
        </button>
      </form>
    </div>
  );
}
