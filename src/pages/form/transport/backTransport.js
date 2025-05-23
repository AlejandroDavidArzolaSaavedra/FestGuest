import { app } from "../../../firebase/initializeDatabase.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { agregarSugerencias } from "../../../utils/suggestionsLocation/addSuggestion.js";

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  agregarSugerencias('origen', 'origen-suggestions');
  agregarSugerencias('destino', 'destino-suggestions');
  agregarSugerencias('festivalName', 'festival-suggestions');
  validacionFormulario();
}

function validacionFormulario() {
  document.getElementById('rutaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    handleSubmit(event);
  });
}

async function handleSubmit(event) {
  const formValues = getFormValues();
  if (validateForm(formValues)) {
    try {
      await addTransportToFirestore(formValues);
    } catch (error) {
      console.error("Error adding transport: ", error);
    }
  }
}

function getFormValues() {
  const userDocString = localStorage.getItem('userDoc');
  if (userDocString) {
    const userDoc = JSON.parse(userDocString);            
    const userName = userDoc.userName;
    console.log(userName)
    return {
      nombreAnuncioCoche: document.getElementById('nombreAnuncioCoche').value,
      origen: document.getElementById('origen').value,
      destino: document.getElementById('destino').value,
      numeroAsientosLibres: document.getElementById('numeroAsientosLibres').value,
      descripcion: document.getElementById('descripcion').value,
      precio: document.getElementById('precio').value,
      festivalAsociado: document.getElementById('festivalName').value,
      usuario: userName
    };
  }
}

function validateForm(formValues) {
  if (!formValues.nombreAnuncioCoche || !formValues.origen || !formValues.destino || !formValues.numeroAsientosLibres || !formValues.descripcion || !formValues.precio) {
    alert("All fields are required. Please fill out the entire form.");
    return false;
  } else if (formValues.descripcion.length < 20) {
    alert("Description must be at least 20 characters long");
    return false;
  }
  return true;
}

async function addTransportToFirestore(formValues) {
  const db = getFirestore(app);
  try {
    const docRef = await addDoc(collection(db, 'transports'), formValues);
    console.log("Document written with ID: ", docRef.id);
    window.location.href = './../../../../src/index.html'
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
