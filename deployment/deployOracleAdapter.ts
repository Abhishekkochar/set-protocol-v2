import { ether } from "../utils"
import DeployHelper from "../utils/deploys"

const oracles = {
    "USDC_USD": "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
    "DAI_USDC":  "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19",
    "ETH_USD": "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    "BTC_USD": "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
    "LINK_USD": "0xc59E3633BAAC79493d908e63626716e204A45EdF",
};


export async function deployOracleAdapter({deployer}: IOracleParams){
    console.log("Deploying Chainlink adpators ...")
    const oracleAddresses:Record<string, string> = {}

    try{
        for (const [key, address] of Object.entries(oracles)){
            const oracle = await deployer.adapters.deployChainlinkOrcaleAdapter(address)
            oracleAddresses[`${key}`] = oracle.address
            console.log(`${key} adapter oracle address: ${oracle.address}`);
        }
        console.log("Finished deploying oracle adaptors!\n")
    } catch(e){
        console.error("Error deploying one or more adapters: ", e)
    }
    return oracleAddresses
}

interface IOracleParams{
    deployer: DeployHelper;
}