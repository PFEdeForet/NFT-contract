const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");


describe("NFTGenTests", function() {
  let owls;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    // deploy the contract before every test
    const OutstantingOwls = await ethers.getContractFactory("OutstandingOwls");
    owls = await OutstantingOwls.deploy();
    await owls.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should check that a user's initial NFT balance is 0", async function() {
    let balance = await owls.balanceOf(owner.address);
    expect(balance).to.equal(0);
  });


  it("Should check that an NFT can be safely minted by the owner of the contract", async function() {
    const medatataURI = "abcd"
    await owls.safeMint(addr1.address, medatataURI);
    let balance = await owls.balanceOf(addr1.address);
    expect(balance).to.equal(1);
  });

  it("Shoud check that the NFT was minted with the proper metadata", async function() {
    const medatataURI = "efgh"
    await owls.safeMint(addr1.address, medatataURI);
    let meta = await owls.tokenURI(0);
    expect(meta).to.equal("ipfs://efgh");
  });

  it("Shoud check that an NFT can not be minted via safemint with duplicated metadata", async function() {
    const medatataURI = "efgh"
    await owls.safeMint(addr1.address, medatataURI);
    try{
      await owls.safeMint(addr1.address, medatataURI);
    }catch(err){
      expect(err.message).to.contain('NFT already minted!');
    }
  });

  it("Should check that an NFT can not be minted via safemint by another address", async () => {
    const medatataURI = 'azerty';
    try{
      await owls.connect(addr1).safeMint(addr1.address, medatataURI);
    }catch(err){
      expect(err.message).to.contain('Ownable: caller is not the owner');
    }
  });

  it("Should check that the owner of a token can burn it", async function () {
    const medatataURI = 'aaaa';
    await owls.safeMint(addr1.address, medatataURI);
    await owls.connect(addr1).burn(0);
    let balance = await owls.balanceOf(addr1.address);
    expect(balance).to.equal(0);

  });

  it("Should check that a token can not be burned by someone other than its owner", async function() {
    const medatataURI = 'aaaa';
    await owls.safeMint(addr1.address, medatataURI);
    try{
      await owls.connect(addr2).burn(0);
    }catch(err){
      expect(err.message).to.contain('Burnable: caller is not owner nor approved');
    }
  });

  it("Should verify the burn of an NFT", async function() {
    const medatataURI = 'aaaa';
    await owls.safeMint(addr1.address, medatataURI);
    await owls.connect(addr1).burn(0);
    try{
      await owls.ownerOf(0);
    }catch(err){
      expect(err.message).to.contain('ERC721: owner query for nonexistent token');
    }
  });

  it("Should check that an NFT can be flagged as already owned", async function() {
    const medatataURI = 'aaaa'
    await owls.safeMint(addr1.address, medatataURI);
    let isOwned = await owls.isNFTOwned('aaaa');
    expect(isOwned).to.equal(true);
  });

  it("Should check that the burn of an NFT does not affect other tokens' ID", async function() {
    const medatataURI1 = 'aaaa'
    const medatataURI2 = 'bbbb'
    await owls.safeMint(addr1.address, medatataURI1);
    await owls.safeMint(addr2.address, medatataURI2);
    await owls.connect(addr1).burn(0);
    let owner = await owls.ownerOf(1);
    expect(owner).to.equal(addr2.address);
  });

  it("Should check that the wildMint function allows anyone to mint", async function() {
    const medatataURI = 'aaaa';
    await owls.connect(addr1).wildMint(addr1.address, medatataURI, {value : ethers.utils.parseEther('3')});
    let balance = await owls.balanceOf(addr1.address);
    expect(balance).to.equal(1);
  });

  it("Should check that the wildMint function blocks your mint if the value provided is insufficient", async function() {
    const medatataURI = 'aaaa';
    try{
      await owls.connect(addr1).wildMint(addr1.address, medatataURI, {value : ethers.utils.parseEther('2.99999999')});
    }catch(err){
      expect(err.message).to.contain('Pay more money!');
    }
  });

  it("Should check that the initial balance of the contract is 0 ", async function() {
    let balance = await owls.connect(addr1).balanceSC();
    expect(balance).to.equal(0);
  });

  it("Should check that the balance is updated when a mint is processed", async function() {
    const medatataURI = 'aaaa';
    await owls.connect(addr1).wildMint(addr1.address, medatataURI, {value : ethers.utils.parseEther('3')});
    let balance = await owls.connect(addr1).balanceSC();
    expect(balance).to.equal(BigNumber.from(3).mul(BigNumber.from(10).pow(18)));
  });

  it("Should check that the balance is reset when a withdrawal is processed", async function() {
    const medatataURI = 'aaaa';
    await owls.connect(addr1).wildMint(addr1.address, medatataURI, {value : ethers.utils.parseEther('3')});
    await owls.connect(owner).withdrawFunds();
    let balance = await owls.connect(owner).balanceSC();
    expect(balance).to.equal(0);
  });
  

});