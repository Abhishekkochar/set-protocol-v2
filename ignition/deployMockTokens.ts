import { ether } from "../utils"
import DeployHelper from "../utils/deploys"

export async function deployMockTokens({deployer, owner}: IMockTokensParams){
    console.log("Deploying Mock tokens...")
    const usdcContract = await deployer.mocks.deployTokenMock(owner, ether(1000000000), 6, "MUSDC Coin", "mUsdc")
    const usdtContract = await deployer.mocks.deployTokenMock(owner, ether(1000000000), 6, "MUSDT Coin", "mUsdt")
    const btcContract = await deployer.mocks.deployTokenMock(owner, ether(1000000000), 18, "MBTC Coin", "mBtc")
    const WETH = await deployer.external.deployWETH()
    console.log("USDC address: ", usdcContract.address)
    console.log("USDT address: ", usdtContract.address)
    console.log("BTC address: ", btcContract.address)
    console.log("WETH address: ", WETH.address)
    console.log("Finished deploying mock tokens!\n")
    return {USDT:usdtContract, USDC:usdcContract, BTC:btcContract, WETH, USDCAddress:usdcContract.address,
        USDTAddress:usdtContract.address,BTCAddress:btcContract.address, WETHAddress:WETH.address}
}

interface IMockTokensParams{
    deployer: DeployHelper;
    owner: string;
}