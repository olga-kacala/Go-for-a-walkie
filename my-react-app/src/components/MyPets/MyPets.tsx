import { useContext, useEffect, useState } from "react";
import { AppContext, Pet } from "../Providers/Providers";
import classes from "./MyPets.module.css";
import { firebaseDb, firebaseAuth } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, uploadBytes, ref } from "firebase/storage";

export function MyPets(): JSX.Element {
  const {
    animals,
    username,
    setUsername,
    myAnimalsList,
    setmyAnimalsList,
    removeFromList,
    addToList,
    petName,
    breed,
    selectedSex,
    selectedTemper,
    dateOfBirth,
    setPetName,
    setDateOfBirth,
    setBreed,
    setSelectedSex,
    setSelectedTemper,
    setIsLogged,
    resultMyPets,
    setResultMyPets,
    logoTransform,
    logoPop,
    photoURL,
    setPhotoURL,
  } = useContext(AppContext);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();
  const storage = getStorage();

  useEffect((): void => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const userEmail = user.email;
        setUsername(userEmail);
        setIsLogged(true);
        const docRef = doc(firebaseDb, "MyPets", `${user.email}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setmyAnimalsList(data.animals);
          setResultMyPets("Your pet list:");
          const petWithDateOfBirth = data.animals.find((pet: Pet) => pet.dateOfBirth instanceof Date);

          if (petWithDateOfBirth) {
            setDateOfBirth(petWithDateOfBirth.dateOfBirth);
          }
        } else {
          setUsername("");
          setmyAnimalsList([]);
        }
      } else {
        setUsername("");
        setmyAnimalsList([]);
      }
    });
  }, [setmyAnimalsList, setUsername, setIsLogged, setDateOfBirth, animals]);

  useEffect(() => {
    if (myAnimalsList.length === 0) {
      setResultMyPets("Your list of pets is empty");
    } else {
      setResultMyPets("Your pet list");
    }
  }, [myAnimalsList]);

  function calculateAge(dateOfBirth: Date | null): {
    years: number;
    months: number;
  } {
    if (!dateOfBirth) {
      return { years: 0, months: 0 };
    }
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (
      today.getDate() < birthDate.getDate() ||
      (today.getDate() === birthDate.getDate() &&
        today.getHours() < birthDate.getHours())
    ) {
      years--;
      months += 12;
    }
    return { years, months };
  }

  function isFormValid(): boolean {
    return (
      petName !== "" &&
      dateOfBirth !== null &&
      breed !== "" &&
      selectedSex !== "" &&
      selectedTemper !== ""
    );
  }

  //Custom Hook
  function useAuth(): any | null {
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    useEffect(() => {
      const unsub = onAuthStateChanged(firebaseAuth, (user) =>
        setCurrentUser(user)
      );
      return unsub;
    }, []);
    return currentUser;
  }

  async function upload(
    file: File | null,
    currentUser: any | null,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (!file || !currentUser) return; 
    const storage = getStorage();

    if (!storage) {
      console.error("Storage instance is undefined");
      return;
    }

    const fileRef = ref(storage, `${currentUser?.uid}.png`);
    setLoading(true);
    try {
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);
      await updateProfile(currentUser, { photoURL });
      setPhotoURL(photoURL);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Failed to upload");
    }
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const objectURL = URL.createObjectURL(file);
      setPhotoURL(objectURL);
    }
  }

  function handleProfile() {
    upload(photo, currentUser, setLoading);
  }

  useEffect(() => {
    if (currentUser && currentUser.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  function handleDelete(pet: Pet) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (confirmDelete) {
      removeFromList(pet.id);
    }
  }

  return (
    <div>
      <div className={classes.Pets}>
        <div className={classes.PetList}>
          <h2>{resultMyPets}</h2>
          {myAnimalsList.map((pet) => (
            <div
              className={pet.sex === "female" ? classes.female : classes.male}
              key={pet.id}
            >
              <div>
                <img
                  src={pet.photoURL ? pet.photoURL : "/Img/profilePic.png"}
                  alt="profile pic of a dog"
                  className={classes.profilePic}
                />
              </div>

              <div className={classes.dataContainer}>
                <span className={classes.title}>name: </span>{" "}
                <span className={classes.child}>{pet.name}</span>
                <div>
                  <span className={classes.title}>age: </span>{" "}
                  <span className={classes.child}>
                    {typeof pet.dateOfBirth === "string"
                      ? "Unknown"
                      : `${calculateAge(pet.dateOfBirth).years} years ${
                          calculateAge(pet.dateOfBirth).months
                        } months`}
                  </span>
                </div>
                <div>
                  <span className={classes.title}>breed: </span>{" "}
                  <span className={classes.child}>{pet.breed}</span>
                </div>
                <div>
                  <span className={classes.title}>sex: </span>{" "}
                  <span className={classes.child}>{pet.sex}</span>
                </div>
                <div>
                  <span className={classes.title}>temper: </span>{" "}
                  <span className={classes.child}>{pet.temper}</span>
                </div>
                <button
                  className={classes.delete}
                  onClick={() => handleDelete(pet)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={classes.InputContainer}>
          <h2>Add your new pet</h2>
          <form className={classes.myPetsInput}>
            <input
              name="pet name"
              type="string"
              value={petName ?? ""}
              placeholder="Pet name"
              required
              onChange={(e) => {
                setPetName(e.target.value);
              }}
            />
            <DatePicker
              id="date"
              selected={dateOfBirth}
              placeholderText="Date of Birth"
              onChange={(date) => setDateOfBirth(date as Date)}
              value={dateOfBirth ? dateOfBirth.toLocaleDateString() : ""}
            />

            <input
              name="breed"
              type="string"
              value={breed ?? ""}
              placeholder="Breed"
              required
              onChange={(e) => {
                setBreed(e.target.value);
              }}
            />
            <select
              value={selectedSex ?? ""}
              onChange={(e) => {
                setSelectedSex(e.target.value);
              }}
            >
              <option value="">Select sex</option>
              <option value="female">Female&#9792;</option>
              <option value="male">Male&#9794;</option>
            </select>
            <select
              value={selectedTemper ?? ""}
              onChange={(e) => {
                setSelectedTemper(e.target.value);
              }}
            >
              <option value="">Select temper</option>
              <option value="tiger">
                &#x1F405; Tiger - powerful body and hyperactive individual
              </option>
              <option value="sloth">
                &#x1F9A5; Sloth - slow-motion lifestyle and charming appearances
              </option>
              <option value="octopus">
                &#x1F419; Octopus - shy and secretive behavior
              </option>
            </select>
            <input type="file" onChange={handleChange} />
            <button
              disabled={loading}
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                handleProfile();
                if (isFormValid()) {
                  logoTransform(logoPop);
                  addToList({
                    owner: username,
                    id: Date.now(),
                    name: petName ?? "",
                    dateOfBirth: dateOfBirth,
                    breed: breed ?? "",
                    sex: selectedSex ?? "",
                    temper: selectedTemper ?? "",
                    photoURL: photoURL ?? "Img/profilePic.png",
                  });
                }
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
