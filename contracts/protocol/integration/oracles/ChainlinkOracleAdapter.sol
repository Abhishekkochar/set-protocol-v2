pragma solidity 0.6.10;
/**
 * @title ChainlinkOracleAdapter
 * @author Set Protocol
 *
 * Coerces outputs from Chainlink oracles to uint256 and adapts value to 18 decimals.
 */
contract ChainlinkOracleAdapter {
    using SafeMath for uint256;

    /* ============ Constants ============ */
    uint256 public constant PRICE_MULTIPLIER = 1e10;

    /* ============ State Variables ============ */
    AggregatorInterface public oracle;

    /* ============ Constructor ============ */
    /*
     * Set address of aggregator being adapted for use
     *
     * @param  _oracle    The address of medianizer being adapted from bytes to uint256
     */
    constructor(
        AggregatorInterface _oracle
    )
        public
    {
        oracle = _oracle;
    }

    /* ============ External ============ */

    /*
     * Reads value of oracle and coerces return to uint256 then applies price multiplier
     *
     * @returns         Chainlink oracle price in uint256
     */
    function read()
        external
        view
        returns (uint256)
    {
        // Read value of medianizer and coerce to uint256
        uint256 oracleOutput = uint256(oracle.latestAnswer());

        // Apply multiplier to create 18 decimal price (since Chainlink returns 8 decimals)
        return oracleOutput.mul(PRICE_MULTIPLIER);
    }
}