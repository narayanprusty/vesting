const { expect } = require("chai");
const { ethers } = require("hardhat");
const sleep = require("sleep-promise");

describe("Vesting", function () {
  it("Should test the vesting release interval", async function () {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("Test", "TST");
    const tokenAddress = (await token.deployed()).address;

    const owner = (await ethers.getSigners())[0].address;
    let balance = await token.balanceOf(owner);

    expect(balance).to.equal(1000000);

    const Vesting = await ethers.getContractFactory("Vesting")

    const beneficiaryAddress = (await ethers.getSigners())[1].address;
    const startTimestamp = ((new Date()).getTime()) / 1000
    const durationSeconds = 24 * 60 * 60;
    const interval = 5; 
    
    const vesting = await Vesting.deploy(
      beneficiaryAddress,
      parseInt(startTimestamp),
      durationSeconds,
      interval 
    )

    const vestingAddress = (await vesting.deployed()).address
    await token.transfer(vestingAddress, 1000)

    balance = await token.balanceOf(owner);
    expect(balance).to.equal(1000000 - 1000);

    /*
    Due to this:
    https://issueexplorer.com/issue/nomiclabs/hardhat/1869
    https://github.com/ethers-io/ethers.js/issues/119#issuecomment-861024418
    */
    await expect(vesting['release(address)'](tokenAddress)).to.be.revertedWith("Interval hasn't passed")
    await network.provider.send("evm_increaseTime", [3])
    await vesting['release(address)'](tokenAddress);
  });
});
