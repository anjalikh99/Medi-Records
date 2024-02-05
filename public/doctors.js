const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

// Function to display/hide the modal on click of consult button and display desired data
function consult(event) {
  modal.classList.toggle("show-modal");
  if (event.id) {
    const tr = document.getElementById(`tr${event.id}`);
    const doctorAddress = document.querySelector(
      `#tr${event.id} :nth-child(1)`
    );
    const consultFees = document.querySelector(`#tr${event.id} :nth-child(4)`);
    document.getElementById(
      "consult-fees"
    ).value = `${consultFees.textContent}`;
    document.getElementById("doc-address").value = doctorAddress.textContent;
  }
}

function windowOnClick(event) {
  if (event.target === modal) {
    consult();
  }
}

closeButton.addEventListener("click", consult);
window.addEventListener("click", windowOnClick);

// Function call from Doctors.html on window onload to display list of all doctors
function getDoctors() {
  // Function call for method declared in contractMethods.js to get Doctor's list
  getDoctorsList();
}

// Function call from modal button Pay & Confirm for payment of fees and book appointmet
function makePayment() {
  const doctorAddress = document
    .getElementById("doc-address")
    .value.toLowerCase();
  const patAddress = localStorage.getItem("PatUser");
  const doctorArray = JSON.parse(localStorage.getItem(`${patAddress}`));
  console.log(doctorArray);
  const patients = JSON.parse(localStorage.getItem(`${doctorAddress}`));
  console.log(patients);
  for (let i = 0; i < doctorArray.length; i++) {
    if (
      doctorArray[i].address === doctorAddress ||
      patients[i].address === patAddress
    ) {
      alert("Appointment already taken!!");
      return;
    }
  }
  payToDoctor(doctorArray, patients);
}
