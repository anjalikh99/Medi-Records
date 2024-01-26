//SPDX-License-Identifier: MIT
// Compiler version declaration for solidity
pragma solidity ^0.7.0;
// New ABI decoder which supports structs and nested arrays
pragma experimental ABIEncoderV2;

contract MediRecords{
    // Struct to store patient's records i.e prescription by the doctor
    /* @info ------------
      cid - string stored which depicts the url of file stored on IPFS
      fileName - Name of file uploaded on IPFS
      patientId - wallet address of patient 
      doctorId - wallet address of doctor
      timeAdded - Block timestamp of the record uploaded in milliseconds
    */
    struct Record { 
        string cid;
        string fileName;
        address patientId;
        address doctorId;
        uint256 timeAdded;
    }
    
    // Struct to store Doctor's Details
    struct Doctor{
        string doctorName;
        string email;
        string speciality;
        string gender;
        string regNumber;
        address walletAddress;
    }

    // Struct to store Patient's Details
    struct Patient{
        uint phone;
        string patientName;
        string email;
        string ailment;
        string gender;
        Record[] records;
        address walletAddress;
    }

    // mapping to store doctor's details corresponding to wallet address of the Doctor
    mapping(address => Doctor) public doctorList;

    //mapping to store patient's details corresponding to wallet address of the Patient
    mapping(address => Patient) public patientList;

    // Array to store wallet addresses of Doctor's
    address[] public doctors;

    // Count of Doctors registered
    uint public doctorsCount=0;

    // event emitted when new patient is added
    event PatientAdded(address patientId);

    // event emitted when new doctor is added
    event DoctorAdded(address doctorId);

    // event emitted when new record is added to Patient details by the corresponding Doctor
    event RecordAdded(string cid, address patientId, address doctorId);

    // modifier to check if a user is registered as a Doctor
    modifier isDoctor() {
        require(doctorList[msg.sender].walletAddress == msg.sender, "Incorrect Address");
        _;
    }
    
    // modifier to check if a user is registered as a Patient
    modifier isPatient() {
        require(patientList[msg.sender].walletAddress == msg.sender, "Incorrect Address");
        _;
    }

    // function to register as new Doctor to the mapping along with details in arguments of function
    function addDoctor(string memory _name, string memory _email, string memory _specs, string memory _gender, string memory reg_num) public returns(bool){
        require(msg.sender != doctorList[msg.sender].walletAddress, "Doctor Already Exists");
        doctorList[msg.sender] = Doctor(_name, _email, _specs, _gender, reg_num, msg.sender);
        doctors.push(msg.sender);
        ++doctorsCount;
        emit DoctorAdded(msg.sender);
        return true;
    }

    // function to register as new Patient to the mapping along with the details in arguments of function
    function addPatient(uint _phone, string memory _name, string memory _email, string memory _ailment, string memory _gender) public returns(bool)
    {
        require(msg.sender != patientList[msg.sender].walletAddress, "Patient Already Exists");
        patientList[msg.sender].phone = _phone;
        patientList[msg.sender].patientName = _name;
        patientList[msg.sender].email = _email;
        patientList[msg.sender].ailment = _ailment;
        patientList[msg.sender].gender = _gender;
        patientList[msg.sender].walletAddress = msg.sender;
        emit PatientAdded(msg.sender);
        return true;
    }

    // function to add new Record for corresponding patient Id by the Doctor
    function addRecord(string memory _cid, string memory _fileName, address _patientId) public isDoctor returns(bool){
        require(patientList[_patientId].walletAddress == _patientId, "Patient Does not exist");
        Record memory record = Record(_cid, _fileName, _patientId, msg.sender, block.timestamp);
        patientList[_patientId].records.push(record);

        emit RecordAdded(_cid, _patientId, msg.sender);
        return true;
    } 

    // function to retrieve patient records using the patient id by the Doctor
    function getPatientDetails(address _patientId) public view isDoctor returns (Record[] memory) {
        require(patientList[_patientId].walletAddress == _patientId, "Patient Does not exist");
        return patientList[_patientId].records;
    }
}