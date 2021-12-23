import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import ColorLand from "./build/contracts/ColorLand.json";
import MarketplaceLand from "./build/contracts/MarketplaceLand.json";
import { Navbar, Container } from "react-bootstrap";

function App() {
  const [colorLandContract, setColorLandContract] = useState();
  const [marketplaceLandContract, setMarketplaceLandContract] = useState();
  const [account, setAccount] = useState();
  const [landPrice, setLandPrice] = useState(0);
  const [totalLand, setTotalLand] = useState();
  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    loadMetamask();
    loadBlockchainData();
  }, [account]);

  const loadMetamask = async () => {
    console.log("Hello");
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

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkData = await ColorLand.networks[5777];
    if (networkData) {
      const abi = ColorLand.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setColorLandContract(contract);
      const total = await contract.methods.getTotal().call();
      setTotalLand(total);
      const price = await contract.methods.getCurrentPrice().call();
      setLandPrice(price * 10 ** 18);
      console.log(parseInt(price));
    }

    const networkMarketplaceData = await MarketplaceLand.networks[5777];
    if (networkMarketplaceData) {
      const abiMarketplace = MarketplaceLand.abi;
      const addressMarketplace = networkMarketplaceData.address;
      const contractMarketplace = new web3.eth.Contract(
        abiMarketplace,
        addressMarketplace
      );
      setMarketplaceLandContract(contractMarketplace);
      if (account) {
        const totalNft = await contractMarketplace.methods
          .getNftOfUser(account)
          .call();
        console.log(totalNft);
        setNftList(totalNft);
      }
    }
  };

  const handleMint = async () => {
    console.log({ landPrice });
    const mintToken = await marketplaceLandContract.methods
      .buyLand()
      .send({ value: landPrice, from: account });
    console.log(mintToken);
    const balance = await colorLandContract.methods.balanceOf(account).call();
    console.log(balance);
  };

  return (
    <div className="App">
      <Navbar>
        <Container>
          <Navbar.Brand href="#home">ColorLand</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>{account}</Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <p>Total: {totalLand}</p>
      <button onClick={handleMint}>Mint</button>
      <br />
      <br />
      <br />
      <br />
      {nftList}
      {nftList.map((index) => {
        return <p key={index}>{index}</p>;
      })}
    </div>
  );
}

export default App;
