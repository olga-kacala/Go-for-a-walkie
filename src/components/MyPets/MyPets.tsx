import { useContext, useEffect, useState, useRef } from "react";
import { AppContext, Pet } from "../Providers/Providers";
import classes from "./MyPets.module.css";
import { firebaseDb, firebaseAuth } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, uploadBytes, ref } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";

export type MyPetsProps = {
  upload: (
    file: File | null,
    currentUser: any | null,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    petId: number
  ) => Promise<string | null>;
};

type Id = string | number;

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
  const currentUser = useAuth();
  const navigate = useNavigate();

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
      setDateOfBirth(null);
      setBreed("");
      setSelectedSex("");
      setSelectedTemper("");
      setPhotoURL(null);
      setError("");
      navigate("/RedirectPets");
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
        setDateOfBirth(null);
        const docRef = doc(firebaseDb, "MyPets", `${user.email}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setmyAnimalsList(data.animals);
          setResultMyPets("Your pet list:");
          setDateOfBirth(null);

          const petWithDateOfBirth = data.animals.find(
            (pet: Pet) => pet.dateOfBirth instanceof Timestamp
          );

          if (petWithDateOfBirth) {
            const dateOfBirthValue = petWithDateOfBirth.dateOfBirth.toDate();
            setDateOfBirth(dateOfBirthValue);
            setDateOfBirth(null);
          }
        } else {
          setmyAnimalsList([]);
          setDateOfBirth(null);
        }
      } else {
        setUsername("");
        setmyAnimalsList([]);
        setDateOfBirth(null);
      }
    });
  }, [
    setUsername,
    setIsLogged,
    setmyAnimalsList,
    setDateOfBirth,
    setResultMyPets,
  ]);

  useEffect(() => {
    if (myAnimalsList.length === 0) {
      setResultMyPets("Your list of pets is empty");
    } else {
      setResultMyPets("Your pet list");
    }
  }, [myAnimalsList, setResultMyPets]);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();

  const toastIdRef = useRef<Id | null>(null);

  useEffect(() => {
    const petsWithBirthday = myAnimalsList.filter((pet) => {
      if (pet.dateOfBirth) {
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

    if (petsWithBirthday.length > 0) {
      const petNames = petsWithBirthday.map((pet) => pet.name).join("& ");

      if (!toast.isActive(String(toastIdRef.current))) {
        toastIdRef.current = toast.info(
          <div className={classes.BirthdayContainer}>
            <a
              href="https://www.amazon.com/Dog-Birthday-Gifts/s?k=Dog+Birthday+Gifts"
              target="_blank"
              rel="noreferrer"
            >
              <p className={classes.BirthdayText}>
                Today is the birthday of {petNames}! 🎉🎉🎂 Let's celebrate and
                get the purrfect birthday presents! 🎁🦴
              </p>
            </a>
          </div>,
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
    }
    return () => {
      // Cleanup toast when component unmounts
      if (toastIdRef.current && toast.isActive(String(toastIdRef.current))) {
        toast.dismiss(String(toastIdRef.current));
      }
    };
  }, [myAnimalsList, currentDay, currentMonth]);

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

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
      months--;
    }

    if (months < 0) {
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
      selectedTemper !== "" &&
      photoURL !== null
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
  }, [currentUser, setPhotoURL]);

  function handleDelete(pet: Pet) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (confirmDelete) {
      removeFromList(pet.id);
    }
  }

  return (
    <div className={classes.myPetsContainer}>
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
          <form>
            <input
              className={classes.selectContainer}
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
              className={classes.selectContainer}
              selected={dateOfBirth}
              placeholderText="Date of Birth"
              showYearDropdown
              dateFormat="d MMMM yyyy"
              maxDate={new Date()}
              required
              onChange={(date) => setDateOfBirth(date as Date)}
              value={dateOfBirth ? dateOfBirth.toLocaleDateString() : ""}
            />
            <input
              className={classes.selectContainer}
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
              className={classes.selectContainer}
              value={selectedSex ?? ""}
              required
              onChange={(e) => {
                setSelectedSex(e.target.value);
              }}
            >
              <option value="">Select sex</option>
              <option value="female">Female&#9792;</option>
              <option value="male">Male&#9794;</option>
            </select>
            <select
              className={classes.selectContainer}
              value={selectedTemper ?? ""}
              required
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
            <input
              className={classes.selectContainer}
              type="file"
              required
              onChange={handleChange}
            />
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
