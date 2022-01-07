//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/finance/VestingWallet.sol";

contract Vesting is VestingWallet {
  uint256 private interval; // 5 * 60
  uint256 private lastRelease;

  constructor(
    address beneficiaryAddress,
    uint64 startTimestamp,
    uint64 durationSeconds,
    uint256 _interval
  ) VestingWallet(beneficiaryAddress, startTimestamp, durationSeconds) {
    interval = _interval;
    lastRelease = block.timestamp;
  }

  modifier checkInterval() {
    if(block.timestamp - lastRelease < interval) {
      revert("Interval hasn't passed");
    }
    _;
  }

  function release(address tokenContractAddress) public override checkInterval {
    VestingWallet.release(tokenContractAddress);
    lastRelease = block.timestamp;
  }
}
