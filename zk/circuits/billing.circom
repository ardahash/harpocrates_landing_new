pragma circom 2.1.8;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/bitify.circom";

template BillingProof() {
    // Private inputs (witness)
    signal input inputTokens;
    signal input outputTokens;
    signal input userSecret;
    signal input nonce;

    // Public inputs (limbs)
    signal input userLo;
    signal input userHi;
    signal input modelIdLo;
    signal input modelIdHi;
    signal input priceLo;
    signal input priceHi;
    signal input costLo;
    signal input costHi;
    signal input usageHashLo;
    signal input usageHashHi;
    signal input nullifierLo;
    signal input nullifierHi;

    // Range constraints
    component inputBits = Num2Bits(64);
    inputBits.in <== inputTokens;
    component outputBits = Num2Bits(64);
    outputBits.in <== outputTokens;

    component userLoBits = Num2Bits(128);
    userLoBits.in <== userLo;
    component userHiBits = Num2Bits(128);
    userHiBits.in <== userHi;
    component modelLoBits = Num2Bits(128);
    modelLoBits.in <== modelIdLo;
    component modelHiBits = Num2Bits(128);
    modelHiBits.in <== modelIdHi;
    component priceLoBits = Num2Bits(128);
    priceLoBits.in <== priceLo;
    component priceHiBits = Num2Bits(128);
    priceHiBits.in <== priceHi;
    component costLoBits = Num2Bits(128);
    costLoBits.in <== costLo;
    component costHiBits = Num2Bits(128);
    costHiBits.in <== costHi;
    component usageLoBits = Num2Bits(128);
    usageLoBits.in <== usageHashLo;
    component usageHiBits = Num2Bits(128);
    usageHiBits.in <== usageHashHi;
    component nullifierLoBits = Num2Bits(128);
    nullifierLoBits.in <== nullifierLo;
    component nullifierHiBits = Num2Bits(128);
    nullifierHiBits.in <== nullifierHi;

    var TWO_POW_128 = 340282366920938463463374607431768211456;

    // Recompose public values
    signal userField;
    userField <== userLo + userHi * TWO_POW_128;

    signal modelIdField;
    modelIdField <== modelIdLo + modelIdHi * TWO_POW_128;

    signal priceField;
    priceField <== priceLo + priceHi * TWO_POW_128;

    signal costField;
    costField <== costLo + costHi * TWO_POW_128;

    signal usageHashField;
    usageHashField <== usageHashLo + usageHashHi * TWO_POW_128;

    signal nullifierField;
    nullifierField <== nullifierLo + nullifierHi * TWO_POW_128;

    // Constraint 1: cost = (input + output) * price
    signal totalTokens;
    totalTokens <== inputTokens + outputTokens;
    costField === totalTokens * priceField;

    // Constraint 2: usageHash = Poseidon(user, modelId, inputTokens, outputTokens, nonce)
    component usagePoseidon = Poseidon(5);
    usagePoseidon.inputs[0] <== userField;
    usagePoseidon.inputs[1] <== modelIdField;
    usagePoseidon.inputs[2] <== inputTokens;
    usagePoseidon.inputs[3] <== outputTokens;
    usagePoseidon.inputs[4] <== nonce;
    usageHashField === usagePoseidon.out;

    // Constraint 3: nullifier = Poseidon(userSecret, usageHash)
    component nullifierPoseidon = Poseidon(2);
    nullifierPoseidon.inputs[0] <== userSecret;
    nullifierPoseidon.inputs[1] <== usageHashField;
    nullifierField === nullifierPoseidon.out;
}

component main {public [
    userLo,
    userHi,
    modelIdLo,
    modelIdHi,
    priceLo,
    priceHi,
    costLo,
    costHi,
    usageHashLo,
    usageHashHi,
    nullifierLo,
    nullifierHi
]} = BillingProof();
