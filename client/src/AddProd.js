import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import axios from "axios";

function AddProd() {
  const navigate = useNavigate();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedName, setMedName] = useState();
  const [MedDes, setMedDes] = useState();
  const [MedStage, setMedStage] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    setCurrentaccount(account);


    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(
        SupplyChainABI.abi,
        networkData.address
      );
      setSupplyChain(supplychain);
      var i;
      const medCtr = await supplychain.methods.productCtr().call();
      const med = {};
      const medStage = [];

      for (i = 0; i < medCtr; i++) {
    
        med[i] = await supplychain.methods.ProductStock(i + 1).call();
        medStage[i] = await supplychain.methods.showStage(i + 1).call();
      }

      setMED(med);
      setMedStage(medStage);
      setloader(false);

      console.log(`MED: `, med);
      console.log(`MEDSTAGE: ${medStage}`);

    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };
  if (loader) {
    return (
      <div>
        <h1 className="wait">Loading...</h1>
      </div>
    );
  }
  const redirect_to_home = () => {
    navigate("/");
  };
  const handlerChangeNameMED = (event) => {
    setMedName(event.target.value);
  };
  const handlerChangeDesMED = (event) => {
    setMedDes(event.target.value);
  };
  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .addProduct(MedName, MedDes)
        .send({ from: currentaccount });
      if (reciept) {
        
        const latestCounter = await SupplyChain.methods.getLatestProductCounter().call();
        
        console.log("LATEST COUNTER: ", latestCounter);

        const latestData = await SupplyChain.methods.getProductData(latestCounter).call();

        console.log("LATEST DATA: ", latestData);

        await saveData(latestData);
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const saveData = async (latestData) => {
    const { data } = await axios.post("https://mongodb-api-production-2b24.up.railway.app/product", latestData);
    console.log("API response: ", data);
  }

  return (
    <div className="add-root">
      <div className="roles-account">
        <b>Current Account Address: </b> {currentaccount}
      </div> 
      <div className="add-container">

        <h5 className="add-header">Add New Product:</h5>
        <form className="form-control-div" onSubmit={handlerSubmitMED}>
          <input
            className="form-control-sm"
            type="text"
            onChange={handlerChangeNameMED}
            placeholder="Product Name"
            required
          />
          <input
            className="form-control-sm"
            type="text"
            onChange={handlerChangeDesMED}
            placeholder="Product Description"
            required
          />
          <button
            className="form-btn"
            onSubmit={handlerSubmitMED}
          >
            Order
          </button>
        </form>
        <br />
        <h5 className="add-header">Created Products:</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Current Stage</th>
            </tr>
          </thead>
          <tbody>
            
            {Object.keys(MED).map(function (key) {
              return (

                <tr key={key}>
                  <td>{MED[key].id}</td>
                  <td>{MED[key].name}</td>
                  <td>{MED[key].description}</td>
                  <td>{MedStage[key]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    
  );
}

export default AddProd;
