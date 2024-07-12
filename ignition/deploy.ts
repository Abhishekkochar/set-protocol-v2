import { getAccounts } from "../utils/test"
import DeployHelper from "../utils/deploys";
import { ether } from "../utils/index";
import { ethers } from "ethers";
import { SetToken__factory } from "../typechain";
import { approveModules } from "./approve";
import { deployMockTokens } from "./deployMockTokens";
import { deployModules } from "./deployModules";
import { deployCoreContracts } from "./deployCoreContracts";

const usdcUSDC = "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E" 
const daiUSDC =  "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19"
const wbtcUSDC = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"
const ethUSDC =  "0x694AA1769357215DE4FAC081bf1f309aDC325306"

const provider = new ethers.providers.JsonRpcProvider("http://[::1]:8545")

async function deploy(){
    try{
        
    const [owner, feeRecipient, userOne] = await getAccounts();
    const deployer = new DeployHelper(owner.wallet)

    // Deploying the controllerContract
    const {controllerContract, setTokenCreator, integrationContract, valuerContract, controllerAddress, tokenCreatorAddress, integrationAddress, valuerAddress} = await deployCoreContracts({deployer, feeAddress:feeRecipient.address})

    // Deploying mock tokens
    const {USDC, USDT, BTC, WETH, USDCAddress, USDTAddress, BTCAddress, WETHAddress} = await deployMockTokens({deployer, owner: owner.address})

    // Deploying Price Oracle
    const priceOracleContract = await deployer.core.deployPriceOracle(controllerAddress, USDCAddress, [],[USDCAddress, USDTAddress, BTCAddress, WETHAddress], [USDCAddress, USDCAddress, USDCAddress, USDCAddress], [usdcUSDC, daiUSDC, wbtcUSDC, ethUSDC ])
    console.log("Price Oracle contract address: ", priceOracleContract.address)

    // GeneralIndexModule: this will help with rebalance
    const {generalIndexContract, issuanceContract, generalIndexAddress, issuanceAddress} = await deployModules({deployer, controllerAddress, WETHAddress})

    // Initilaize the Controller contract
    await controllerContract.connect(owner.wallet).initialize([tokenCreatorAddress], [generalIndexAddress, issuanceAddress],[integrationAddress, priceOracleContract.address, valuerAddress], [0,1,2])
    console.log("Controller has been initialized... \n")

    // Deploying SetToken
    await setTokenCreator.create([USDTAddress, BTCAddress], [10000,1], [generalIndexAddress, issuanceAddress], owner.address, "BTC_USDT Index", "EBU")
    const vaultAddress =  await controllerContract.getSets()
    console.log("Token Set - ETH-BTC_USDT Index address", vaultAddress[0], "\n")

    // Before issue token, modules must be basicIssuanceModule must be initialized with manager address.
    // Initilzing the issuance Module.
    await issuanceContract.connect(owner.wallet).initialize(vaultAddress[0], ethers.constants.AddressZero)
    // Instance of tokenSet 
    const vaultContract = new ethers.Contract(vaultAddress[0], SetToken__factory.abi, provider)

    console.log(await vaultContract.getComponents())

    // Approve module before trying to issuing the tokens. 
    // To mint 1 token of vault, we need to provide 1ETH, 1 USDT, 1 BTC.
    await approveModules({USDC, USDT, BTC, WETH, userOne, module: issuanceAddress})
    await USDT.mint(userOne.address, ether(10))
    await BTC.mint(userOne.address, ether(10))

    // Before balance of userOne
    console.log((await vaultContract.balanceOf(userOne.address)).toString())
    // Issuing token.
    await issuanceContract.connect(userOne.wallet).issue(vaultAddress[0], ether(2), userOne.address)
    // After balance
    console.log((await vaultContract.balanceOf(userOne.address)).toString())
    console.log(await valuerContract.calculateSetTokenValuation(vaultContract.address, USDCAddress))

    } catch(e){
        console.error(e)
    }
    
    
}

deploy()