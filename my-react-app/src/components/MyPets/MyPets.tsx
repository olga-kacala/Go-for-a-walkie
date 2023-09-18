import { useContext, useEffect, useState } from "react";
import { AppContext, Pet } from "../Providers/Providers";
import classes from "./MyPets.module.css";
import { firebaseDb, firebaseAuth } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, uploadBytes, ref } from "firebase/storage";
import { Timestamp } from "firebase/firestore";

export type MyPetsProps = {
  upload: (
    file: File | null,
    currentUser: any | null,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    petId: number
  ) => Promise<string | null>;
};

export function MyPets(): JSX.Element {
  const {
    username,
    setUsername,
    myAnimalsList,
    setmyAnimalsList,
    removeFromList,
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
    setError,
  } = useContext(AppContext);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [BDToday, setBDToday] = useState(false);
  const currentUser = useAuth();

  const addToList = async (product: Pet): Promise<void> => {
    try {
      const petId = Date.now();
      const newProduct = {
        ...product,
        id: petId,
        name: petName?.toUpperCase() ?? "",
        dateOfBirth: dateOfBirth,
      };
      const uploadedPhotoURL = await upload(
        photo,
        currentUser,
        setLoading,
        petId
      );
      if (uploadedPhotoURL) {
        newProduct.photoURL = uploadedPhotoURL;
      }
      await setDoc(doc(firebaseDb, "MyPets", `${username}`), {
        animals: [...myAnimalsList, newProduct],
      });
      setmyAnimalsList([...myAnimalsList, newProduct]);
      setPetName("");
      setDateOfBirth(new Date());
      setBreed("");
      setSelectedSex("");
      setSelectedTemper("");
      setPhotoURL(null);
      setError("");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
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

          const petWithDateOfBirth = data.animals.find(
            (pet: Pet) => pet.dateOfBirth instanceof Timestamp
          );

          if (petWithDateOfBirth) {
            const dateOfBirthValue = petWithDateOfBirth.dateOfBirth.toDate();
            setDateOfBirth(dateOfBirthValue);
          }
        } else {
          setmyAnimalsList([]);
        }
      } else {
        setUsername("");
        setmyAnimalsList([]);
      }
    });
  }, [setUsername, setIsLogged, setmyAnimalsList]);

  useEffect(() => {
    if (myAnimalsList.length === 0) {
      setResultMyPets("Your list of pets is empty");
    } else {
      setResultMyPets("Your pet list");
    }
  }, [myAnimalsList]);

  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Months are 0-based (0 = January)

    // Check if any pet has a birthday with the same day and month as today
    const hasBirthdayToday = myAnimalsList.some((pet) => {
      if (pet.dateOfBirth) {
        // Handle different date formats (Timestamp or Date)
        const petDateOfBirth =
          pet.dateOfBirth instanceof Timestamp
            ? pet.dateOfBirth.toDate()
            : new Date(pet.dateOfBirth);

        const petDay = petDateOfBirth.getDate();
        const petMonth = petDateOfBirth.getMonth();

        return petDay === currentDay && petMonth === currentMonth;
      }
      return false;
    });

    setBDToday(hasBirthdayToday);
  }, [myAnimalsList]);


  function calculateAge(dateOfBirth: Date | Timestamp | null): {
    years: number;
    months: number;
  } {
    if (!dateOfBirth) {
      return { years: 0, months: 0 };
    }

    const birthDate =
      dateOfBirth instanceof Timestamp ? dateOfBirth.toDate() : dateOfBirth;

    const today = new Date();
    // const birthDate = new Date(dateOfBirth);
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
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    petId: number
  ) {
    if (!file || !currentUser) return;
    const storage = getStorage();
    if (!storage) {
      console.error("Storage instance is undefined");
      return;
    }
    const fileName = `${petId}.png`;
    const fileRef = ref(storage, fileName);
    setLoading(true);
    try {
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);
      return photoURL;
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Failed to upload");
      return null;
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
        {BDToday ? (
        <div>
          {/* Render this div when there are pets with a birthday today */}
          <p>Today is a special day for your pets!</p>
        </div>
      ) : (
        <div>
          {/* Render this div when there are no pets with a birthday today */}
          <p>No birthdays today.</p>
        </div>
      )}
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
                <span className={classes.title}>name: </span>
                <span className={classes.child}>{pet.name}</span>
                <div>
                  <span className={classes.title}>age: </span>
                  <span className={classes.child}>
                    {pet.dateOfBirth instanceof Timestamp
                      ? `${
                          calculateAge(pet.dateOfBirth.toDate()).years
                        } years ${
                          calculateAge(pet.dateOfBirth.toDate()).months
                        } months`
                      : "Unknown"}
                  </span>
                </div>
                <div>
                  <span className={classes.title}>birthday: </span>
                  <span className={classes.child}>
                    {pet.dateOfBirth instanceof Timestamp
                      ? pet.dateOfBirth.toDate().toLocaleDateString()
                      : "Unknown"}
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
              showYearDropdown
              dateFormat="d MMMM yyyy"
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
