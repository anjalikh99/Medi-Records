const { expect } = require("chai");
let contract;
// Group of test conditions to test Medirecords Contract
describe("MediRecords Contract deployment", function () {
  // Test to check that the address deployer of the contract should be equal to the address of first account of the hardhat ecosystem
  it("The contract should deploy successfully", async () => {
    // Retrieve an array of signers from the hardhat ecosystem and assign the first account to owner variable
    const [owner] = await ethers.getSigners();

    //  Create an instance of MediRecords Contract
    const mediContract = await ethers.getContractFactory("MediRecords");

    //  Deploy the smart contract to the network
    contract = await mediContract.deploy();

    // Verify if the address used to deploy the contract is equal to the address of owner
    expect(contract.deploymentTransaction().from).to.equal(owner.address);
  });
});

// Group of test conditions to test MediRecords Contract Events emitted
describe("MediRecords Contract Events", function () {
  // Test to check if DoctorAdded event is emitted with argument as address of caller when addDoctor method is called
  it("Adding Doctor should emit Doctor Added Event", async () => {
    const [owner] = await ethers.getSigners();
    expect(
      contract.addDoctor(
        "Krishan Kumar",
        "krishanrsinghal@gmail.com",
        "Orthopedician",
        "Male",
        "KS1234"
      )
    )
      .to.emit(contract, "DoctorAdded")
      .withArgs(owner.address);
  });

  // Test to check if PatientAdded event is emitted with argument as address of caller when addPatient method is called
  it("Adding Patient should emit Patient Added Event", async () => {
    const [owner] = await ethers.getSigners();
    expect(
      contract.addPatient(
        "8303673253",
        "Joynath Barman",
        "joynath12@gmail.com",
        "Teeth Bite",
        "Male"
      )
    )
      .to.emit(contract, "PatientAdded")
      .withArgs(owner.address);
  });

  // Test to check if RecordAdded event is emitted with arguments cid, patientId, address of doctor when addRecord method is called
  it("Adding Patient Records should emit Record Added Event", async () => {
    const [owner] = await ethers.getSigners();
    expect(
      contract.addRecord(
        "QmaSHGobmMWyGec6SWukGxvfnC2RiLqjTeof3CK3FopM9W",
        "Prescription.pdf",
        "0xd9cd2f4b34f0ea6783738a0e4542e151e32857df"
      )
    )
      .to.emit(contract, "RecordAdded")
      .withArgs(
        "QmaSHGobmMWyGec6SWukGxvfnC2RiLqjTeof3CK3FopM9W",
        "0xd9cd2f4b34f0ea6783738a0e4542e151e32857df",
        owner.address
      );
  });

  // Test to check that the function addRecord should revert with message "Incorrect Address" when called by address which is not in doctorList
  it("Testing Add Records if Doctor not present", async () => {
    const [owner] = await ethers.getSigners();
    expect(
      contract
        .connect(owner.address)
        .addRecord(
          "QmaSHGobmMWyGec6SWukGxvfnC2RiLqjTeof3CK3FopM9W",
          "Prescription.pdf",
          "0xd9cd2f4b34f0ea6783738a0e4542e151e32857df"
        )
    ).to.be.revertedWith("Incorrect Address");
  });
});

// Group of test conditions to test Stored Values
describe("MediRecords Contract Stored Values", function () {
  let newContract;
  // Test to check if the values in doctorList is added correctly by addDoctor Function
  it("Testing Doctors Stored Value", async () => {
    const mediRecord = await ethers.getContractFactory("MediRecords");
    newContract = await mediRecord.deploy();

    const [owner] = await ethers.getSigners();
    await newContract.addDoctor(
      "Krishna Singhal",
      "krishanrsinghal1@gmail.com",
      "Surgeon",
      "Male",
      "KS1234"
    );

    const doctorList = await newContract.doctorList(owner.address);
    expect(doctorList[0]).to.equal("Krishna Singhal");
    expect(doctorList[1]).to.equal("krishanrsinghal1@gmail.com");
    expect(doctorList[2]).to.equal("Surgeon");
    expect(doctorList[3]).to.equal("Male");
    expect(doctorList[4]).to.equal("KS1234");
    expect(doctorList[5]).to.equal(owner.address);
  });

  // Test to check if the values in patientList is added correctly by addPatient Function
  it("Testing Patients Stored Value", async () => {
    const [owner] = await ethers.getSigners();
    await newContract.addPatient(
      "7005454542",
      "Salman Barbhuiya",
      "salmanb@gmail.com",
      "Lung Cancer",
      "Male"
    );

    const patientList = await newContract.patientList(owner.address);
    expect(patientList[0]).to.equal("7005454542");
    expect(patientList[1]).to.equal("Salman Barbhuiya");
    expect(patientList[2]).to.equal("salmanb@gmail.com");
    expect(patientList[3]).to.equal("Lung Cancer");
    expect(patientList[4]).to.equal("Male");
    expect(patientList[5]).to.equal(owner.address);
  });
});
