// Event listener added to button with id login in Login.html to display the login form
document.getElementById("login").addEventListener("click", (e) => {
  if (e.target.id === "login") {
    const login = document.getElementById("login-form");
    const register = document.getElementById("register-form");
    login.style.display = "block";
    register.style.display = "none";
  }
});

// Event listener added to button with id signup in Login.html to display the signup form
document.getElementById("signup").addEventListener("click", (e) => {
  if (e.target.id === "signup") {
    const login = document.getElementById("login-form");
    const register = document.getElementById("register-form");
    login.style.display = "none";
    register.style.display = "block";
  }
});

// Event listener added to select element (id = register-as) in Login.html to toggle between signup form for Doctor and Patient as per the values selected
document.getElementById("register-as").addEventListener("change", (e) => {
  if (e.target.value === "Doctor") {
    const doc = document.getElementById("docregister");
    const pat = document.getElementById("patregister");
    const h1 = document.querySelector("#register-form h1");
    h1.textContent = "Sign Up as Doctor";
    doc.style.display = "block";
    pat.style.display = "none";
  } else if (e.target.value === "Patient") {
    const doc = document.getElementById("docregister");
    const pat = document.getElementById("patregister");
    const h1 = document.querySelector("#register-form h1");
    h1.textContent = "Sign Up as Patient";
    doc.style.display = "none";
    pat.style.display = "block";
  }
});

// Event listener added to Login as Doctor button to initiate login process for registered Doctors
document
  .getElementById("docLoginButton")
  .addEventListener("click", async (e) => {
    // Method called from contractMethods.js for verification of Doctor
    initializeDoctorLogin();
  });

// Event listener added to Login as Patient button to initiate login process for registered Patients
document
  .getElementById("patLoginButton")
  .addEventListener("click", async (e) => {
    // Method called from contractMethods.js for verification of Patient
    initializePatientLogin();
  });

// Event Listener added to Register button for Signup as Doctor form to register as a new Doctor
document.getElementById("regDoctor").addEventListener("click", async (e) => {
  // Method called from contractMethods.js for registration process of Doctor
  registerAsDoctor();
});

// Event Listener added to Register button for Signup as Patient form to register as a new Patient
document.getElementById("reg-pat").addEventListener("click", async (e) => {
  // Method called from contractMethods.js for registration process of Patient
  registerAsPatient();
});
