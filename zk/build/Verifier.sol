// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Groth16Verifier {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 19080779516094333351198090993396578338983395774047575463567385054264932880951;
    uint256 constant alphay  = 900160306471546082445868731881870238483431413502863527787597267574693674198;
    uint256 constant betax1  = 8022064322609541154570306100258917328703418277446925328228378139042912586825;
    uint256 constant betax2  = 523813420445944021008467298314493450624351178252532826796504816286732184920;
    uint256 constant betay1  = 7580782310393565654140900265191260355534736438691996069992040394783371151169;
    uint256 constant betay2  = 4764029971290127595669114959233364920205113835581766193855626505902520054030;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 2324064976283166533614389065074136881762322437384368781484138349010697542027;
    uint256 constant deltax2 = 7128298776972646263274715500790905851087286402788171771817005940368583089551;
    uint256 constant deltay1 = 14000310101035833924218761836061835198863555668251311555651477238211757386064;
    uint256 constant deltay2 = 3023026570072485989343772230335045747123429902982730958787446829792295086035;

    
    uint256 constant IC0x = 10269537141281987489142115884758500963731140584014625429456251542664979980735;
    uint256 constant IC0y = 9647831609754104076990459306992735500446715590151075545841780565755094992714;
    
    uint256 constant IC1x = 17468345213471055064632042713277423373593275632288920337955325577168385152694;
    uint256 constant IC1y = 21466637529881484275395893890050597493673150814681020633834658162584378609836;
    
    uint256 constant IC2x = 20940822427947680560326138605599973790097731527305330860469321824133849809545;
    uint256 constant IC2y = 16803734415793625270357288572691726965939402923478258730172843583525715822803;
    
    uint256 constant IC3x = 10075803790334211734653650364121419628484517272652741921794759887370021536199;
    uint256 constant IC3y = 14528044515616152482942047732695283141999063046272572939142426965401845623571;
    
    uint256 constant IC4x = 21447977778923899805241145756530680986863180873879128538167073926395925976188;
    uint256 constant IC4y = 17047356126093250718259457718174894869132039164473469227752050471420067794510;
    
    uint256 constant IC5x = 4843721705186030270121220530638517425014803096317319481822190545989635459116;
    uint256 constant IC5y = 7718273788588244689131263029095180677074747337716151535893455961827705731741;
    
    uint256 constant IC6x = 17012068612315498123677987505248090474582757129777811747258396887030060646271;
    uint256 constant IC6y = 11033327963757759487760831951554707491643607636017612151917465158486471325654;
    
    uint256 constant IC7x = 8733844390171097547510224996490726345217173211231176099103131429655155231382;
    uint256 constant IC7y = 11333233920613544747880690853087009957431903512645352584615735602993884571594;
    
    uint256 constant IC8x = 17500290219748317742571903777841983034668176390492029691617058783762731740983;
    uint256 constant IC8y = 7362022387115685191509787394427973668517128465797685971793333652066910292808;
    
    uint256 constant IC9x = 4990210258784534616514789827536328755118616685150780767270764385100748358651;
    uint256 constant IC9y = 13714886075551629891454667904662848476852789624897418189343505241149998434265;
    
    uint256 constant IC10x = 14590681259415865114176266698169338333484114065047374826150980571836656392624;
    uint256 constant IC10y = 18421625444454264771053546382240445107726017661899259968194665636864260034470;
    
    uint256 constant IC11x = 9274454459807675352416879412694117979048633114329780979478568494158806538330;
    uint256 constant IC11y = 7994237854445580831158733200371442311226202167945405261428361872366211028215;
    
    uint256 constant IC12x = 14283585885845239185453606982851820895474068013835507330673236965641450606310;
    uint256 constant IC12y = 16283089495590020619139267461588465159263259351356178136529226253211958592682;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, r)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                
                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))
                
                g1_mulAccC(_pVk, IC3x, IC3y, calldataload(add(pubSignals, 64)))
                
                g1_mulAccC(_pVk, IC4x, IC4y, calldataload(add(pubSignals, 96)))
                
                g1_mulAccC(_pVk, IC5x, IC5y, calldataload(add(pubSignals, 128)))
                
                g1_mulAccC(_pVk, IC6x, IC6y, calldataload(add(pubSignals, 160)))
                
                g1_mulAccC(_pVk, IC7x, IC7y, calldataload(add(pubSignals, 192)))
                
                g1_mulAccC(_pVk, IC8x, IC8y, calldataload(add(pubSignals, 224)))
                
                g1_mulAccC(_pVk, IC9x, IC9y, calldataload(add(pubSignals, 256)))
                
                g1_mulAccC(_pVk, IC10x, IC10y, calldataload(add(pubSignals, 288)))
                
                g1_mulAccC(_pVk, IC11x, IC11y, calldataload(add(pubSignals, 320)))
                
                g1_mulAccC(_pVk, IC12x, IC12y, calldataload(add(pubSignals, 352)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            
            checkField(calldataload(add(_pubSignals, 32)))
            
            checkField(calldataload(add(_pubSignals, 64)))
            
            checkField(calldataload(add(_pubSignals, 96)))
            
            checkField(calldataload(add(_pubSignals, 128)))
            
            checkField(calldataload(add(_pubSignals, 160)))
            
            checkField(calldataload(add(_pubSignals, 192)))
            
            checkField(calldataload(add(_pubSignals, 224)))
            
            checkField(calldataload(add(_pubSignals, 256)))
            
            checkField(calldataload(add(_pubSignals, 288)))
            
            checkField(calldataload(add(_pubSignals, 320)))
            
            checkField(calldataload(add(_pubSignals, 352)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
