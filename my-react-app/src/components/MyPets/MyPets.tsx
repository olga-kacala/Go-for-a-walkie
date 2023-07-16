import { useContext, useState } from "react";
import { AppContext } from "../Providers/Providers";
import { AddPet } from "../Providers/Providers";
import classes from "./MyPets.module.css";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../App";
import { Pet } from "../Providers/Providers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
    removeFromList,
  } = useContext(AppContext);
  const [petName, setPetName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [selectedSex, setSelectedSex] = useState<string>("");
  const [selectedTemper, setSelectedTemper] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  function calculateAge(dateOfBirth: Date | null): number | string {
    if (!dateOfBirth) {
      return 'Unknown';
    }
  
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  const handleSubmitPet = async (product: Pet): Promise<void> => {
    try {
      await setDoc(doc(firebaseDb, "MyPets", `${username}`), {
        animals: [...myAnimalsList, product] as Pet[],
      });
      setmyAnimalsList((prevList: Pet[]) => {
        const updatedList = prevList.concat(product);
        return updatedList;
      });;


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

  

  return (
    <div>
      <h2>My Pets</h2>
      <div className={classes.Pets}>
        <div className={classes.PetList}>
          {myAnimalsList.map((pet) => (
            
            <div key={pet.id}>
              <div>
              <div>Name: {pet.name}</div>
              <div>Date of birth: {pet.dateOfBirth && pet.dateOfBirth.toLocaleDateString()}</div>
              <div>Age: {calculateAge(pet.dateOfBirth) || 'Unknown'} years</div>
              <div>Breed: {pet.breed}</div>
              <div>Sex: {pet.sex}</div>
              <div>Temper: {pet.temper}</div>
              <button onClick={() => removeFromList(pet.id)}>Delete ❌</button>
              </div>
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
            <DatePicker   
  selected={dateOfBirth}
  placeholderText="Date of Birth"
  onChange={(date) => setDateOfBirth(date)}
  value={dateOfBirth ? dateOfBirth.toLocaleDateString() : ""}
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
                  dateOfBirth: dateOfBirth,
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
