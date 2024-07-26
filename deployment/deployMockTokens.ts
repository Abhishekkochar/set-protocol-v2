import { ether } from "../utils"
import DeployHelper from "../utils/deploys"

export async function deployMockTokens({deployer, owner}: IMockTokensParams){
    console.log("Deploying Mock tokens...")
    const usdcContract = await deployer.mocks.deployTokenMock(owner, ether(1000000000), 6, "MUSDC Coin", "mUsdc")
    const daiContract = await deployer.mocks.deployTokenMock(owner, ether(1000000000), 6, "Mdai Coin", "mdai")
    const btcContract = await deployer.mocks.deployTokenMock(owner, ether(1000000000), 18, "MBTC Coin", "mBtc")
    const WETH = await deployer.external.deployWETH()
    console.log("USDC address: ", usdcContract.address)
    console.log("DAI address: ", daiContract.address)
    console.log("BTC address: ", btcContract.address)
    console.log("WETH address: ", WETH.address)
    console.log("Finished deploying mock tokens!\n")
    return {DAI:daiContract, USDC:usdcContract, BTC:btcContract, WETH, USDCAddress:usdcContract.address,
        DAIAddress:daiContract.address,BTCAddress:btcContract.address, WETHAddress:WETH.address}
}

interface IMockTokensParams{
    deployer: DeployHelper;
    owner: string;
}