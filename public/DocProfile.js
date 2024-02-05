// Function call from DocProfile.html on window onload to retrieve Doctor's details from blockchain and display
function getDetails() {
  // address of doctor stored in localStorage during doctor's registration
  let address = localStorage.getItem("DocUser");

  // Function call of method declared in contractMethods.js to get doctor details
  getDoctorDetails(address);
}

//Function call from DocProfile.html on click of Update button to update the consultation fees of doctor
function updateFee() {
  updateConsultationFees();
}

// Function call from PatProfile.html on window onload to retrieve Patient's details from blockchain and display
function getPatDetails() {
  // address of patient stored in localStorage during patient's registration
  let address = localStorage.getItem("PatUser");

  // Function call for method declared in contractMethods.js to get patient details
  getPatientDetails(address);
}

// Function invoked on window onload in Appointments.html to get all the appointments scheduled for the patient
function getAppointments() {
  const patAddress = localStorage.getItem("PatUser");

  // Array of doctors selected for consultation by the current patient stored in localStorage
  const doctorAddressArray = JSON.parse(localStorage.getItem(`${patAddress}`));
  getSelectedDoctors(doctorAddressArray);
}

// Function invoked on window onload in Patients.html to get all the patients pending to be checked by the doctor
function getPatientArray() {
  const docAddress = localStorage.getItem("DocUser").toLowerCase();

  // Array of patients that the current doctor need to check stored in localStorage
  const patientAddressArray = JSON.parse(localStorage.getItem(`${docAddress}`));
  getSelectedPatients(patientAddressArray);
}

// Function invoked when button viewRecords in Patients.html is clicked by the Doctor to view patient's Records
function viewRecords(event) {
  const id = parseInt(event.id.substr(4));
  const docAddress = localStorage.getItem("DocUser").toLowerCase();
  const patientArray = JSON.parse(localStorage.getItem(`${docAddress}`));
  const patientAddress = patientArray[id].address;
  getPatientRecords(patientAddress, event.id);
}

// Function invoked when button complete consultation in Patients.html is clicked by the Doctor if he/she has checked the patient
// The patient is removed from the doctor's array and doctor is removed from the patient's array stored in localStorage
function markComplete(event) {
  const id = parseInt(event.id.substr(4));
  const docAddress = localStorage.getItem("DocUser").toLowerCase();
  const patientArray = JSON.parse(localStorage.getItem(`${docAddress}`));
  const patientAddress = patientArray[id].address;
  const doctorArray = JSON.parse(localStorage.getItem(`${patientAddress}`));
  let doctorsId;
  for (let i = 1; i < doctorArray.length; i++) {
    if (doctorArray[i].address === docAddress) {
      doctorsId = i;
    }
  }
  if (patientAddress) {
    patientArray.splice(id, 1);
    doctorArray.splice(doctorsId, 1);
    localStorage.setItem(`${docAddress}`, JSON.stringify(patientArray));
    localStorage.setItem(`${patientAddress}`, JSON.stringify(doctorArray));

    // Function to display the remaining patients after removal is invoked from contractMethods.js
    getSelectedPatients(patientArray);
  } else {
    alert("Patient Consultation already completed!");
  }
}

// Function invoked when Reports_Patient.html is loaded to display all the doctors consulted and the prescriptions provided by them to Patient
function getPatientReports() {
  const patAddress = localStorage.getItem("PatUser").toLowerCase();
  viewPatientsReports(patAddress);
}

// Function invoked on click of view Prescription Button on Reports_Patient.html
function viewPrescription(event) {
  const id = parseInt(event.id.substr(4));
  const patAddress = localStorage.getItem("PatUser").toLowerCase();
  viewDoctorPrescription(patAddress, id);
}
