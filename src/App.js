import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import ColorLand from "./build/contracts/ColorLand.json";
import MarketplaceLand from "./build/contracts/MarketplaceLand.json";
import { Navbar, Container, Card, Button, Row, Modal } from "react-bootstrap";
import Square from "./components/Square/Square";

function App() {
  let foo = [];
  for (var i = 0; i < 20; i++) {
    foo.push("");
  }

  const [colorLandContract, setColorLandContract] = useState();
  const [marketplaceLandContract, setMarketplaceLandContract] = useState();
  const [colorLandContractAddress, setColorLandContractAddress] = useState();
  const [marketplaceLandContractAddress, setMarketplaceLandContractAddress] =
    useState();
  const [account, setAccount] = useState();
  const [landPrice, setLandPrice] = useState(0);
  const [totalLand, setTotalLand] = useState();
  const [nftList, setNftList] = useState([]);
  const [lastPriceList, setLastPriceList] = useState([]);
  const [sellPriceList, setSellPriceList] = useState([]);
  const [colorFromAdress, setColorFromAddress] = useState(foo);
  const [tmpPrice, setTmpPrice] = useState(0);
  const [contractOwner, setContractOwner] = useState();
  const [show, setShow] = useState(false);
  const [showMarket, setShowMarket] = useState(false);

  const handleSellClose = () => setShow(false);
  const handleSellButton = () => setShow(true);

  useEffect(() => {
    loadMetamask();
    loadBlockchainData();
  }, [account]);

  const loadMetamask = async () => {
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
    setColorLandContractAddress(networkData.address);
    if (networkData) {
      const abi = ColorLand.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setColorLandContract(contract);
      const total = await contract.methods.getTotal().call();
      setTotalLand(total);
      const price = await contract.methods.getCurrentPrice().call();
      setLandPrice(price * 10 ** 18);
      const nftOwner = await contract.methods.getOwner().call();
      console.log("contract owner:" + nftOwner);
      setContractOwner(nftOwner);
    }

    const networkMarketplaceData = await MarketplaceLand.networks[5777];
    setMarketplaceLandContractAddress(networkMarketplaceData.address);
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
        setNftList(totalNft);
      }

      const totalOwner = await contractMarketplace.methods
        .getAddressOfNfts()
        .call();
      if (totalOwner) {
        console.log(totalOwner);
        totalOwner.map((address, index) => {
          convertAddressToColor(address);
          foo[index] = convertAddressToColor(address);
        });
        setColorFromAddress(foo);
      }

      const lastPrice = await contractMarketplace.methods
        .getLastSellPrice()
        .call();
      console.log(lastPrice);
      setLastPriceList(lastPrice);

      const sellPrice = await contractMarketplace.methods
        .getForSellPrice()
        .call();
      console.log(sellPrice);
      setSellPriceList(sellPrice);
    }
  };

  const convertAddressToColor = (address) => {
    const colorId = address.substr(address.length - 6);
    return "#" + colorId;
  };

  const handleSellClick = async (index) => {
    console.log("Sell" + index + tmpPrice);
    await marketplaceLandContract.methods
      .setSaleNfts(index, tmpPrice)
      .send({ from: account });
  };

  const handleMint = async () => {
    const mintToken = await marketplaceLandContract.methods
      .buyLand()
      .send({ value: landPrice, from: account });
    const balance = await colorLandContract.methods.balanceOf(account).call();
  };

  const renderSquare = (index, color) => {
    return <Square index={index} color={color} />;
  };

  const handlerChangePrice = (event) => {
    setTmpPrice(event.target.value);
  };

  const handleBuyButton = async (index) => {
    console.log(index + 1);
    await marketplaceLandContract.methods
      .buyNftFromMarket(index + 1)
      .send({ from: account });
    console.log("Hello");
  };

  const handleApprove = async () => {
    console.log(colorLandContractAddress, marketplaceLandContractAddress);
    let isApproved = await colorLandContract.methods
      .isApprovedForAll(
        colorLandContractAddress,
        marketplaceLandContractAddress
      )
      .call();
    console.log(isApproved);

    await colorLandContract.methods
      .setApprove(marketplaceLandContractAddress)
      .send({ from: account });

    isApproved = await colorLandContract.methods
      .isApprovedForAll(
        colorLandContractAddress,
        marketplaceLandContractAddress
      )
      .call();
    console.log(isApproved);
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
      <div className="board-row">
        {colorFromAdress.map((color, id) => {
          return (id + 1) % 11 ? (
            renderSquare(id + 1, color)
          ) : (
            <>
              <br />
              {renderSquare(id + 1, color)}
            </>
          );
        })}
      </div>
      <br />
      <br />
      <br />
      <p>Total: {totalLand}</p>
      <button onClick={handleMint}>Mint</button>
      {account == contractOwner ? (
        <button onClick={handleApprove}>Approve</button>
      ) : (
        <br />
      )}

      <br />
      <br />
      <br />
      <br />
      <h2>
        Your land has color:{" "}
        <Square color={convertAddressToColor(account ? account : "")} />
      </h2>
      <Row xs={4} md={4} className="">
        {nftList.map((index) => {
          return (
            <>
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  style={{
                    backgroundColor: colorFromAdress[index - 1],
                    width: "100%",
                    height: "40px",
                  }}
                />
                <Card.Body>
                  <Card.Title>#{index}</Card.Title>
                  <Card.Text>
                    Last buy: {lastPriceList[index - 1]} ETH
                    <br />
                    {sellPriceList[index - 1] == 0 ? (
                      <></>
                    ) : (
                      <>Selling for {sellPriceList[index - 1]} ETH</>
                    )}
                  </Card.Text>
                  {sellPriceList[index - 1] == 0 ? (
                    <Button variant="primary" onClick={handleSellButton}>
                      Sell Land
                    </Button>
                  ) : (
                    <br />
                  )}
                </Card.Body>
              </Card>

              <Modal show={show} onHide={handleSellClose} animation={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Sell NFT #{index}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Sell this Land for:{" "}
                  <input type="number" onChange={handlerChangePrice}></input>{" "}
                  ETH
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleSellClose}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleSellClick(index)}
                  >
                    Sell
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          );
        })}
      </Row>

      <br />
      <br />
      <br />
      <br />
      <br />
      <h2>Marketplace:</h2>
      <Row xs={4} md={4} className="">
        {sellPriceList.map((price, ind) => {
          return (
            <>
              {sellPriceList[ind] != 0 ? (
                <>
                  <Card style={{ width: "18rem" }}>
                    <Card.Img
                      variant="top"
                      style={{
                        backgroundColor: colorFromAdress[ind],
                        width: "100%",
                        height: "40px",
                      }}
                    />
                    <Card.Body>
                      <Card.Title>#{ind + 1}</Card.Title>
                      <Card.Text>
                        <>Selling for {sellPriceList[ind]} ETH</>
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => handleBuyButton(ind)}
                      >
                        Buy Land
                      </Button>
                    </Card.Body>
                  </Card>
                </>
              ) : (
                <br />
              )}
            </>
          );
        })}
      </Row>
    </div>
  );
}

export default App;
