import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Providers/Providers";
import { AddPet } from "../Providers/Providers";
import classes from "./MyPets.module.css";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../App";
import { Pet } from "../Providers/Providers";

type MyPetsProps = {
  myPetsList: AddPet[];
};

export function MyPets({ myPetsList }: MyPetsProps): JSX.Element {
  const {
    resultMyPets,
    username,
    animals,
    myPets,
    setMyPets,
    myAnimalsList,
    setmyAnimalsList,
  } = useContext(AppContext);
  const [petName, setPetName] = useState<string>("");
  const [age, setAge] = useState<number | undefined>();
  const [breed, setBreed] = useState<string>("");
  const [selectedSex, setSelectedSex] = useState<string>("");
  const [selectedTemper, setSelectedTemper] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmitPet = async (product: Pet): Promise<void> => {
    try {
      await setDoc(doc(firebaseDb, "MyPets", `${username}`), {
        animals: [...myAnimalsList, product],
      });
      setmyAnimalsList([...myAnimalsList, product]);
      setPetName("");
      setAge(undefined);
      setBreed("");
      setSelectedSex("");
      setSelectedTemper("");
      setError("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h2>My Pets</h2>
      <div className={classes.Pets}>
        <div className={classes.PetList}>
          {myAnimalsList.map((pet) => (
            <div key={pet.id}>
              <div>Name: {pet.name}</div>
              <div>Age: {pet.age}</div>
              <div>Breed: {pet.breed}</div>
              <div>Sex: {pet.sex}</div>
              <div>Temper: {pet.temper}</div>
            </div>
          ))}
        </div>
        <div className={classes.InputContainer}>
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
              value={age}
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
            <button
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                handleSubmitPet({
                  owner: username,
                  id: Date.now(),
                  name: petName,
                  age: age,
                  breed: breed,
                  sex: selectedSex,
                  temper: selectedTemper,
                });
              }}
            >
              Add Pet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
