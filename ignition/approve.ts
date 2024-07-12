import { ethers } from "ethers"
import { StandardTokenMock, WETH9 } from "../typechain"
import { Account } from "../utils/test/types"

export async function approveModules({USDC, USDT, BTC, WETH, userOne, module}: IApproveModulesParams){
    console.log("Aprroving modules...")
    const maxLimit = ethers.constants.MaxUint256
    await USDC.connect(userOne.wallet).approve(module, maxLimit)
    await USDT.connect(userOne.wallet).approve(module, maxLimit)
    await BTC.connect(userOne.wallet).approve(module, maxLimit)
    await WETH.connect(userOne.wallet).approve(module, maxLimit)
    console.log("Finished aprroving modules!\n")
}

interface IApproveModulesParams{
    USDC: StandardTokenMock;
    USDT: StandardTokenMock;
    BTC: StandardTokenMock;
    WETH: WETH9;
    userOne: Account;
    module: string
}