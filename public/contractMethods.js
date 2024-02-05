let web3;

// Function to create contract instance

async function initializeMetamask() {
  const contractAddress = "0x9093337183ea983EB4A9189FDed7d831135783f3";
  if (typeof window.web3 !== "undefined") {
    web3 = new Web3(window.ethereum);
  } else {
    alert("Please install metamask wallet");
  }
  return new web3.eth.Contract(recordsABI, contractAddress);
}

// Function to verify if the user is already registered as Doctor from mediRecords Contract: if registered redirect to doctor's Dashboard else display message

async function initializeDoctorLogin() {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  recordContract.methods
    .doctorList(accounts[0])
    .call({ from: accounts[0] })
    .then((val) => {
      if (val.walletAddress.toLowerCase() === accounts[0]) {
        localStorage.setItem("DocUser", accounts[0]);
        window.location.href = "DocDashboard.html";
      } else {
        alert("Please register as Doctor!");
      }
    });
}

// Function to verify if the user is already registered as Patient from contract: if registered redirect to patient's Dashboard else display message

async function initializePatientLogin() {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  recordContract.methods
    .patientList(accounts[0])
    .call({ from: accounts[0] })
    .then((val) => {
      if (val.walletAddress.toLowerCase() === accounts[0]) {
        localStorage.setItem("PatUser", accounts[0]);
        window.location.href = "PatDashboard.html";
      } else {
        alert("Please register as Patient!");
      }
    });
}

//Function to register user as Doctor and upload data to the blockchain
async function registerAsDoctor() {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  let gender;
  let walletAddress = document.getElementById("docaddress").value.toLowerCase();
  let genderArray = document.getElementsByName("docgender");
  for (let i = 0; i < genderArray.length; i++) {
    if (genderArray[i].checked) {
      gender = genderArray[i].value;
    }
  }
  let userDetails = {
    name: document.getElementById("docname").value,
    email: document.getElementById("docemail").value,
    specs: document.getElementById("docspecs").value,
    gender: gender,
    registrationNo: document.getElementById("reg-no").value,
    fee: document.getElementById("fee").value,
  };

  if (
    userDetails.name.trim() &&
    userDetails.email.trim() &&
    userDetails.specs.trim() &&
    userDetails.gender &&
    userDetails.registrationNo.trim() &&
    userDetails.fee
  ) {
    if (walletAddress.trim() === accounts[0]) {
      recordContract.methods
        .doctorList(accounts[0])
        .call({ from: accounts[0] })
        .then((val) => {
          if (val.walletAddress !== accounts[0]) {
            recordContract.methods
              .addDoctor(
                userDetails.name,
                userDetails.email,
                userDetails.specs,
                userDetails.gender,
                userDetails.registrationNo,
                userDetails.fee
              )
              .send({ from: accounts[0] })
              .then((result) => {
                if (result.status) {
                  alert("Doctor Details Added Successfully!");
                  localStorage.setItem("DocUser", accounts[0]);
                  localStorage.setItem(
                    `${accounts[0]}`,
                    JSON.stringify([{ address: "", checked: false }])
                  );
                  window.location.href = "DocDashboard.html";
                } else {
                  alert("Something Went Wrong");
                }
              });
          } else {
            alert("User Already exist");
          }
        });
    } else {
      alert("Please enter correct Wallet Address");
    }
  } else {
    alert("Please enter correct details");
  }
}

// Function to register user as a patient and store data to Blockchain
async function registerAsPatient() {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  let gender;
  let walletAddress = document.getElementById("pataddress").value.toLowerCase();
  let genderArray = document.getElementsByName("patgender");
  for (let i = 0; i < genderArray.length; i++) {
    if (genderArray[i].checked) {
      gender = genderArray[i].value;
    }
  }
  let userDetails = {
    name: document.getElementById("patname").value,
    email: document.getElementById("patemail").value,
    gender: gender,
    phoneNo: document.getElementById("phn-no").value,
  };

  if (
    userDetails.name.trim() &&
    userDetails.email.trim() &&
    userDetails.gender &&
    userDetails.phoneNo
  ) {
    if (walletAddress.trim() === accounts[0]) {
      recordContract.methods
        .patientList(accounts[0])
        .call({ from: accounts[0] })
        .then((val) => {
          if (val.walletAddress !== accounts[0]) {
            recordContract.methods
              .addPatient(
                userDetails.phoneNo,
                userDetails.name,
                userDetails.email,
                userDetails.gender
              )
              .send({ from: accounts[0] })
              .then((result) => {
                if (result.status) {
                  alert("Patient Details Added Successfully!");
                  localStorage.setItem("PatUser", accounts[0]);
                  localStorage.setItem(
                    `${accounts[0]}`,
                    JSON.stringify([{ address: "", checked: false }])
                  );
                  window.location.href = "PatDashboard.html";
                } else {
                  alert("Something Went Wrong");
                }
              });
          } else {
            alert("User Already exist");
          }
        });
    } else {
      alert("Please enter correct Wallet Address");
    }
  } else {
    alert("Please enter correct details");
  }
}

//Function to retrieve the details of a Doctor using his/her wallet address
async function getDoctorDetails(address) {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  recordContract.methods
    .doctorList(address)
    .call({ from: accounts[0] })
    .then((val) => {
      if (val.walletAddress.toLowerCase() === address) {
        document.getElementById("docname").value = val.doctorName;
        document.getElementById("docemail").value = val.email;
        document.getElementById("docgender").value = val.gender;
        document.getElementById("docspecs").value = val.speciality;
        document.getElementById("reg-no").value = val.regNumber;
        document.getElementById("consult-fee").value = val.consultationFee;
        document.getElementById("docaddress").value = val.walletAddress;
      } else {
        alert("Something went wrong!");
      }
    });
}

//Function to update the consultation fees of the doctor
async function updateConsultationFees() {
  try {
    let recordContract = await initializeMetamask();
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
    let updatedFees = document.getElementById("consult-fee").value;
    if (updatedFees) {
      recordContract.methods
        .updateFees(updatedFees)
        .send({ from: accounts[0] })
        .then((result) => {
          if (result.status) {
            alert("Fees Updated Successfully");
            getDoctorDetails(accounts[0]);
          }
        });
    }
  } catch (err) {
    alert("An error occurred" + err);
  }
}

// Function to retrieve Patient Details using his/her wallet address
async function getPatientDetails(address) {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  recordContract.methods
    .patientList(address)
    .call({ from: accounts[0] })
    .then((val) => {
      if (val.walletAddress.toLowerCase() === address) {
        document.getElementById("patname").value = val.patientName;
        document.getElementById("patemail").value = val.email;
        document.getElementById("patgender").value = val.gender;
        document.getElementById("phn-no").value = val.phone;
        document.getElementById("pataddress").value = val.walletAddress;
      } else {
        alert("Something went wrong!");
      }
    });
}

// Function to retrieve the whole list of doctor's registered along with their details and display it;
async function getDoctorsList() {
  let recordContract = await initializeMetamask();
  let doctorTable = document.getElementById("doctor-table");
  recordContract.methods
    .doctorsCount()
    .call()
    .then((result) => {
      if (result > 0) {
        for (let i = 0; i < result; i++) {
          recordContract.methods
            .doctors(i)
            .call()
            .then((val) => {
              if (val !== "0x0000000000000000000000000000000000000000") {
                recordContract.methods
                  .doctorList(val)
                  .call()
                  .then((doctor) => {
                    if (doctor) {
                      let tr = document.createElement("tr");
                      createTableRows(doctor, tr, 6);
                      createTableRows(doctor, tr, 0);
                      createTableRows(doctor, tr, 2);
                      createTableRows(doctor, tr, 5);
                      let tdButton = document.createElement("td");
                      let button = document.createElement("button");
                      let content = document.createTextNode("Consult");
                      button.append(content);
                      button.setAttribute("id", `${i}`);
                      button.setAttribute("onclick", "consult(this)");
                      tdButton.append(button);
                      tr.append(tdButton);
                      tr.setAttribute("id", `tr${i}`);
                      doctorTable.append(tr);
                    }
                  });
              }
            });
        }
      }
    });
}

// Function to create table rows and table data for doctor's details dynamically
function createTableRows(doctor, tr, value) {
  let tdName = document.createElement("td");
  tr.append(tdName);
  let content = document.createTextNode(doctor[`${value}`]);
  tdName.append(content);
}

// Function to make payment to the doctor for booking consultation
async function payToDoctor(doctorArray, patients) {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const ailment = document.getElementById("ailment").value;
  const amount = parseInt(document.getElementById("consult-fees").value);
  let toPayAmount = parseInt(amount * 0.000005245281302294794 * 10 ** 18);
  const doctorAddress = document
    .getElementById("doc-address")
    .value.toLowerCase();
  recordContract.methods
    .payDoctor(doctorAddress, ailment)
    .send({ from: accounts[0], value: toPayAmount })
    .then((result) => {
      if (result.status) {
        doctorArray.push({ address: doctorAddress, checked: false });
        patients.push({ address: accounts[0], checked: false });
        localStorage.setItem(`${accounts[0]}`, JSON.stringify(doctorArray));
        localStorage.setItem(`${doctorAddress}`, JSON.stringify(patients));
        alert("Appointment Scheduled");
      }
    });
}
// Function to upload patient reports/ Prescription to the blockchain
async function uploadReports() {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  let cid = document.getElementById("cid").value.trim();
  let diagnosis = document.getElementById("diagnosis").value.trim();
  let patId = document.getElementById("patId").value.trim();

  if (cid && diagnosis && patId) {
    recordContract.methods
      .addRecord(cid, diagnosis, patId)
      .send({ from: accounts[0] })
      .then((result) => {
        if (result.status) {
          alert("Patient Record Updated Successfully");
        }
      });
  } else {
    alert("Please enter correct data");
  }
}

// Function to get the details of Doctors for whom appointment is taken by a particular patient
//and the same is displayed in patient's dashboard
async function getSelectedDoctors(array) {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const mainDiv = document.getElementById("doctor-details");
  if (array.length === 1) {
    mainDiv.innerHTML = `<h2 class="nothing">Nothing to Display</h2>`;
  } else {
    for (let i = 1; i < array.length; i++) {
      if (!array[i].checked) {
        recordContract.methods
          .doctorList(array[i].address)
          .call()
          .then((result) => {
            if (result) {
              const div = document.createElement("div");
              div.setAttribute("class", "doctor");
              for (let j = 0; j < 7; j++) {
                if (j === 3 || j === 5) {
                  continue;
                }
                const pElement = document.createElement("p");
                const ptext = document.createTextNode(`${result[`${j}`]}`);
                pElement.append(ptext);
                div.append(pElement);
              }
              mainDiv.append(div);
            }
          });
      }
    }
  }
}

// Function to get the details of Patients who needs to be checked by the doctor and displayed in Doctor's dashboard
async function getSelectedPatients(array) {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const mainDiv = document.getElementById("doctor-details");
  if (array.length === 1) {
    mainDiv.innerHTML = `<h2 class="nothing">Nothing to Display</h2>`;
  } else {
    for (let i = 1; i < array.length; i++) {
      if (!array[i].checked) {
        recordContract.methods
          .patientList(array[i].address)
          .call()
          .then((result) => {
            if (result) {
              const div = document.createElement("div");
              div.setAttribute("class", "doctor");
              for (let j = 0; j < 6; j++) {
                if (j === 4) {
                  continue;
                }
                const pElement = document.createElement("p");
                const ptext = document.createTextNode(`${result[`${j}`]}`);
                pElement.append(ptext);
                div.append(pElement);
              }
              const viewButton = document.createElement("button");
              const viewText = document.createTextNode("View Records");
              viewButton.append(viewText);
              viewButton.setAttribute("id", `view${i}`);
              viewButton.setAttribute("onclick", "viewRecords(this)");
              const compButton = document.createElement("button");
              const compText = document.createTextNode("Complete Consultation");
              compButton.append(compText);
              compButton.setAttribute("id", `comp${i}`);
              compButton.setAttribute("onclick", "markComplete(this)");
              div.append(viewButton);
              div.append(compButton);
              mainDiv.append(div);
            } else {
              alert("Something went wrong!");
            }
          });
      }
    }
  }
}

// Function to retrieve patient records for the doctor to view
async function getPatientRecords(address, id) {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  recordContract.methods
    .getPatientDetails(address)
    .call()
    .then((result) => {
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          let hash = result[i].cid.trim();
          window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, "_blank");
        }
      } else {
        alert("No Records to display");
      }
    });
}

// Function to allow patient to get all the reports/consulation details

async function viewPatientsReports(address) {
  let recordContract = await initializeMetamask();
  const mainDiv = document.getElementById("doctor-details");
  recordContract.methods
    .getPatientDetails(address)
    .call()
    .then((result) => {
      if (result.length === 0) {
        mainDiv.innerHTML = `<h2 class="nothing">Nothing to Display</h2>`;
      } else {
        result.forEach((record, i) => {
          let doctorAddress = record[3];
          let timestamp = parseInt(record[4]) * 1000;
          let date = new Date(timestamp);
          date = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const div = document.createElement("div");
          div.setAttribute("class", "doctor");
          const pElement = document.createElement("p");
          const ptext = document.createTextNode(`Date:- ${date}`);
          pElement.append(ptext);
          div.append(pElement);
          recordContract.methods
            .doctorList(doctorAddress)
            .call()
            .then((doctor) => {
              if (doctor) {
                for (let j = 0; j < 7; j++) {
                  if (j === 1 || j === 3 || j === 4 || j === 5) {
                    continue;
                  }
                  const pElement = document.createElement("p");
                  const ptext = document.createTextNode(`${doctor[`${j}`]}`);
                  pElement.append(ptext);
                  div.append(pElement);
                }
                const pDiagnosis = document.createElement("p");
                const pDiagnosisText = document.createTextNode(
                  `Diagnosis:- ${record[1]}`
                );
                pDiagnosis.append(pDiagnosisText);
                div.append(pDiagnosis);
                const viewButton = document.createElement("button");
                const viewText = document.createTextNode("View Prescription");
                viewButton.append(viewText);
                viewButton.setAttribute("id", `view${i}`);
                viewButton.setAttribute("onclick", "viewPrescription(this)");
                div.append(viewButton);
                mainDiv.append(div);
              } else {
                alert("Error Retrieving Data");
              }
            });
        });
      }
    });
}

//function to view doctor's prescription when button clicked by patient
async function viewDoctorPrescription(address, id) {
  let recordContract = await initializeMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  recordContract.methods
    .getPatientDetails(address)
    .call()
    .then((result) => {
      if (result.length > 0) {
        let hash = result[id].cid.trim();
        window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, "_blank");
      }
    });
}
