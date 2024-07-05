import { getAccounts } from "../utils/test"
import DeployHelper from "../utils/deploys";
import { ether } from "../utils/index";

async function deploy(){
    
    const [owner, feeRecipient] = await getAccounts();

    const deployer = new DeployHelper(owner.wallet)
    // Deploying the controller
    const controller = await deployer.core.deployController(feeRecipient.address)
    const controllerAddress = controller.address
    console.log("Controller contract address: ", controllerAddress)
    // Deploying setTokenCreator
    const setTokenCreator = await deployer.core.deploySetTokenCreator(controllerAddress)
    const tokenCreatorAddress = setTokenCreator.address
    console.log("Token creator address: ", tokenCreatorAddress)
    // Deployiing integration registry
    const integrationContract = await deployer.core.deployIntegrationRegistry(controllerAddress)
    console.log("Inegration registry contract address: ", integrationContract.address)
    // Deploying setValuer contract
    const valuerContract = await deployer.core.deploySetValuer(controllerAddress)
    console.log("Set vauler contract address: ", valuerContract.address)
    // Deploying mock tokens
    const metaData = [{name: "MUSDC Coin", symbol: "mUsdc", address: " "}, {name: "MDAI Coin", symbol: "mDai", address: " "},{name: "MBTC Coin", symbol: "mWbtc", address: " "}, /*{name: "MWETH coin", symbol: "mWeth", address: " "}*/]
    for(let data of metaData){
        const mockTokenContract = await deployer.mocks.deployTokenMock(owner.address, ether(1000000000), data.symbol === "mWbtc" ? 18 : 6, data.name, data.symbol)
        data.address = mockTokenContract.address
    }
    console.log("Updated metadata: ", metaData)
    const WETH = await deployer.external.deployWETH()
    const WETHAddress = WETH.address
    console.log("WETH contract address: ", WETHAddress)
    // Deploying Price Oracle
    const priceOracleContract = await deployer.core.deployPriceOracle(controllerAddress, metaData[0].address, [],[/*USDC*/metaData[0].address, /*USDT*/metaData[1].address, /*WBTC*/metaData[2].address, /*WETH*/WETHAddress], /* All USDC */ [metaData[0].address, metaData[0].address, metaData[0].address, metaData[0].address], [/*USDC-USDC*/"0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E", /*DAI-USDC*/ "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19",/*WBTC-USDC*/"0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",/*ETH-USDC*/ "0x694AA1769357215DE4FAC081bf1f309aDC325306" ])
    console.log("Price Oracle contract address: ", priceOracleContract.address)
    // GeneralIndexModule: this will help with rebalance
    const generalIndexModuleContract = await deployer.modules.deployGeneralIndexModule(controllerAddress, WETH.address)
    const genearlIndexAddress = generalIndexModuleContract.address
    console.log("General IndexModule Contract: ", genearlIndexAddress)
    // BasicIssuanceModule: to mint and redeem set tokens
    const basicIssuanceModuleContract = await deployer.modules.deployBasicIssuanceModule(controllerAddress)
    const issuanceAddress = basicIssuanceModuleContract.address
    console.log("Basic IssuanceModule Contract: ", issuanceAddress )
    // Deploying SetToken
    const setToken = await deployer.core.deploySetToken([WETHAddress, metaData[2].address, metaData[1].address], [30,30,40], [genearlIndexAddress, issuanceAddress], controllerAddress, owner.address, "ETH-BTC_USDT Index", "EBU")
    const setTokenAddress = setToken.address
    console.log("ETH-BTC-USDt Token set address: ", setTokenAddress)
}

deploy()