import DeployHelper from "../utils/deploys"

export async function deployModules({deployer, controllerAddress, WETHAddress}: IDeployModuleParmas) {
    console.log("Deploying modules...")
    const generalIndexModuleContract = await deployer.modules.deployGeneralIndexModule(controllerAddress, WETHAddress)
    const generalIndexAddress = generalIndexModuleContract.address
    console.log("General IndexModule Contract: ", generalIndexAddress)
    // BasicIssuanceModule: to mint and redeem set tokens
    const basicIssuanceModuleContract = await deployer.modules.deployBasicIssuanceModule(controllerAddress)
    const issuanceAddress = basicIssuanceModuleContract.address
    console.log("Basic IssuanceModule Contract: ", issuanceAddress )
    console.log("Finished deploying modules!\n")
    return {generalIndexContract: generalIndexModuleContract, issuanceContract: basicIssuanceModuleContract, generalIndexAddress: generalIndexModuleContract.address, issuanceAddress: basicIssuanceModuleContract.address}
}

interface IDeployModuleParmas{
    deployer: DeployHelper;
    controllerAddress: string;
    WETHAddress: string
}
