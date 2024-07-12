import DeployHelper from "../utils/deploys"

export async function deployCoreContracts({deployer, feeAddress}:ICoreContractsParams){
    console.log("Deploying core contracts...")
    const controllerContract = await deployer.core.deployController(feeAddress)
    const controllerAddress = controllerContract.address
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
    console.log("Finished deploying core contracts!\n")
    
    return {controllerContract, setTokenCreator, integrationContract, valuerContract, controllerAddress, tokenCreatorAddress, integrationAddress: integrationContract.address, valuerAddress: valuerContract.address}
}
interface ICoreContractsParams{
    deployer:DeployHelper;
    feeAddress: string
}