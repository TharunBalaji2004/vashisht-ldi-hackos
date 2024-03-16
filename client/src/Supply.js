import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import axios from "axios";

function Supply() {

  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();

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

      console.log(`MED: `, med);
      console.log(`MEDSTAGE: ${medStage}`);

      setloader(false);
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

  const handlerChangeID = (event) => {
    setID(event.target.value);
  };
  const handlerSubmitRMSsupply = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .RMSsupply(ID)
        .send({ from: currentaccount });
      if (reciept) {
        console.log("RMS", ID);

        const latestData = await SupplyChain.methods.getProductData(ID).call();
        console.log("DATA: ", latestData);
        await saveData(latestData, ID);
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitManufacturing = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Manufacturing(ID)
        .send({ from: currentaccount });
      if (reciept) {
        const latestData = await SupplyChain.methods.getProductData(ID).call();
        console.log("LATEST DATA: ", latestData);
        await saveData(latestData, ID);
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitDistribute = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Distribute(ID)
        .send({ from: currentaccount });
      if (reciept) {
        const latestData = await SupplyChain.methods.getProductData(ID).call();
        console.log("LATEST DATA: ", latestData);

        await saveData(latestData, ID);
        loadBlockchaindata();
      }
    } catch (err) {
      console.log("ERROR: ", err);
      alert("An error occured!!!");
    }
  };
  const handlerSubmitRetail = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Retail(ID)
        .send({ from: currentaccount });
      if (reciept) {
        const latestData = await SupplyChain.methods.getProductData(ID).call();
        console.log("LATEST DATA: ", latestData);
        await saveData(latestData, ID);
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitSold = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .sold(ID)
        .send({ from: currentaccount });
      if (reciept) {
        const latestData = await SupplyChain.methods.getProductData(ID).call();
        console.log("LATEST DATA: ", latestData);
        await saveData(latestData, ID);
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const saveData = async (latestData, ID) => {
    const productId = ID;
    const { data } = await axios.post(`https://mongodb-api-production-2b24.up.railway.app/product/${productId}`, latestData);

    console.log("API response: ", data);
  }


  return (
    <div className="supply-root">
      <div className="roles-account">
        <b>Current Account Address: </b> {currentaccount}
      </div>  

      {/* <div className="roles-root">

      </div> */}

  <div className="table-block">
  <table className="table table-sm">
    <tbody className="table-body">
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
    <thead className="table-header">
      <tr>
        <th scope="col">Product ID</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
        <th scope="col">Current Stage</th>
      </tr>
    </thead>
  </table>
  </div>

      <div className="form-block">
      <h5>
        <b>Step 1: Supply Raw Materials</b>(Only a registered Raw Material
        Supplier can perform this step):-
      </h5>
      <form onSubmit={handlerSubmitRMSsupply}>
        <input
          className="form-control-sm"
          type="text"
          onChange={handlerChangeID}
          placeholder="Enter Product ID"
          required
        />
        <button
          className="form-btn"
          onSubmit={handlerSubmitRMSsupply}
        >
          Supply
        </button>
      </form>
      </div>
      <hr />
      <br />
      <div className="form-block">
      <h5>
        <b>Step 2: Manufacture</b>(Only a registered Manufacturer can perform
        this step):-
      </h5>
      <form onSubmit={handlerSubmitManufacturing}>
        <input
          className="form-control-sm"
          type="text"
          onChange={handlerChangeID}
          placeholder="Enter Product ID"
          required
        />
        <button
          className="form-btn"
          onSubmit={handlerSubmitManufacturing}
        >
          Manufacture
        </button>
      </form>
      </div>
      <hr />
      <br />
      <div className="form-block">
      <h5>
        <b>Step 3: Distribute</b>(Only a registered Distributor can perform this
        step):-
      </h5>
      <form onSubmit={handlerSubmitDistribute}>
        <input
          className="form-control-sm"
          type="text"
          onChange={handlerChangeID}
          placeholder="Enter Product ID"
          required
        />
        <button
          className="form-btn"
          onSubmit={handlerSubmitDistribute}
        >
          Distribute
        </button>
      </form>
      </div>
      <hr />
      <br />
      <div className="form-block">
      <h5>
        <b>Step 4: Retail</b>(Only a registered Retailer can perform this
        step):-
      </h5>
      <form onSubmit={handlerSubmitRetail}>
        <input
          className="form-control-sm"
          type="text"
          onChange={handlerChangeID}
          placeholder="Enter Product ID"
          required
        />
        <button
          className="form-btn"
          onSubmit={handlerSubmitRetail}
        >
          Retail
        </button>
      </form>
      </div>
      <hr />
      <br />
      <div className="form-block">
      <h5>
        <b>Step 5: Mark as sold</b>(Only a registered Retailer can perform this
        step):-
      </h5>
      <form onSubmit={handlerSubmitSold}>
        <input
          className="form-control-sm"
          type="text"
          onChange={handlerChangeID}
          placeholder="Enter Product ID"
          required
        />
        <button
          className="form-btn"
          onSubmit={handlerSubmitSold}
        >
          Sold
        </button>
      </form>
      </div>
      <hr />
    </div>
  );
}

export default Supply;
