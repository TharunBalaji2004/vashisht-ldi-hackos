import React, { useEffect } from "react";
import Reg from "./images/reg.jpeg";
import ProdReg from "./images/prod_reg.png"
import SupplyChain from "./images/supplyChain.png"
import QrTrack from "./images/qrtrack.png"

function Home() {

  useEffect(() => {
    document.title = "TraZ Supply Chain"
  }, [])

  return (
    <div className="container">
      <div class='steps'>
        <div class='step-container'>
          <h2 class='step-title'>STEP 1</h2>
          <img src={Reg} alt="reg" class='step-image' />
          <div class='step-content'>
            <h2 class='step-heading'>Owner Registration</h2>
            <p class='step-item'><span className='point'></span>Raw material suppliers</p>
            <p class='step-item'><span className='point'></span>Manufacturers</p>
            <p class='step-item'><span className='point'></span>Distributors and Retailers</p>
            <button class='step-button'>Register</button>
          </div>
        </div>

        <div class='step-container'>
          <h2 class='step-title'>STEP 2</h2>
          <img src={ProdReg} alt="reg" class='step-image' />
          <div class='step-content'>
            <h2 class='step-heading'>Product Registration</h2>
            <p class='step-item'><span className='point'></span>Product Name</p>
            <p class='step-item'><span className='point'></span>Product Description</p>
            <p class='step-item'><span className='point'></span>Product Requirements</p>
            <button class='step-button'>Add Product</button>
          </div>
        </div>

        <div class='step-container'>
          <h2 class='step-title'>STEP 3</h2>
          <img src={SupplyChain} alt="reg" class='step-image' />
          <div class='step-content'>
            <h2 class='step-heading'>Control Supply Chain</h2>
            <p class='step-item'><span className='point'></span>Raw material suppliers</p>
            <p class='step-item'><span className='point'></span>Manufacturers</p>
            <p class='step-item'><span className='point'></span>Distributors and Retailers</p>
            <button class='step-button'>Control Supply Chain</button>
          </div>
        </div>

        <div class='step-container'>
          <h2 class='step-title'>STEP 4</h2>
          <img src={QrTrack} alt="reg" class='step-image' />
          <div class='step-content'>
            <h2 class='step-heading'>Track the Product</h2>
            <p class='step-item'><span className='point'></span>product ID</p>
            <p class='step-item'><span className='point'></span>QR code Scanner</p>
            <p class='step-item'><span className='point'></span>Trace Product Journey</p>
            <button class='step-button'>Track Product</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
