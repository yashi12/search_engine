const { assert } = require("chai");

const Mycontract = artifacts.require("Mycontract")

require("chai").use(require("chai-as-promised")).should()

contract("Mycontract",([deployer, doubtAsker, doubtSolver])=>{
    let myContract ;

    before(async ()=>{
        myContract = await Mycontract.deployed()
    })

    describe('deployment', async ()=>{
        it('deploy successfully', async ()=>{
            const address = await myContract.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })

        it('has a name', async ()=>{
            const name = await myContract.name()
            assert.equal(name, 'Doubt Session Contract')
        })
    })

    describe('Session', async ()=>{

        let result, amount ;

        it('session contract created and fee received successfully', async()=>{
            // Track the contract balance before fee
            let oldContractBalance
            oldContractBalance = await web3.eth.getBalance(myContract.address)
            oldContractBalance = new web3.utils.BN(oldContractBalance)

            result = await myContract.createSession(1,doubtAsker,doubtSolver,'Solidity Doubts','1',{from :doubtAsker, value: web3.utils.toWei('1','Ether')})
            amount = web3.utils.toWei('1','Ether')
            amount = new web3.utils.BN(amount)
            //console.log(amount)

            // SUCCESS
            const event = result.logs[0].args
            assert.equal(event.id,'1','id is correct')
            //assert.equal(event.doubtAsker,doubtAsker,"doubt asker's address is not correct")
            assert.equal(event.doubtSolver,doubtSolver,"doubt solver's address is correct")
            assert.equal(event.topic,'Solidity Doubts',"topic is correct")
            assert.equal(event.isCompleted,false,"completion is correct")
            assert.equal(event.amount,amount,"doubt asker's address is correct")


            // Track the contract balance after fee
            let newContractBalance
            newContractBalance = await web3.eth.getBalance(myContract.address)
            newContractBalance = new web3.utils.BN(newContractBalance)

            const expectedBalance = oldContractBalance.add(amount)

            assert.equal(newContractBalance.toString(),expectedBalance.toString(),'Contract Balance Checked')
            
            //console.log(event)
        })

        it('session is completed and fee transferred successfully', async()=>{

            // Track the solver's balance before fee
            let oldSolverBalance
            oldSolverBalance = await web3.eth.getBalance(doubtSolver)
            oldSolverBalance = new web3.utils.BN(oldSolverBalance)

            result = await myContract.endSession('1')
            amount = web3.utils.toWei('1','Ether')
            amount = new web3.utils.BN(amount)

            const event = result.logs[0].args
            assert.equal(event.id,'1','id is correct')
            //assert.equal(event.doubtAsker,doubtAsker,"doubt asker's address is correct")
            assert.equal(event.doubtSolver,doubtSolver,"doubt solver's address is correct")
            assert.equal(event.topic,'Solidity Doubts',"topic is correct")
            assert.equal(event.isCompleted,true,"completion is correct")
            assert.equal(event.amount,amount,"doubt asker's address is correct")
            console.log(event)

            // Track the contract balance after fee
            let newSolverBalance
            newSolverBalance = await web3.eth.getBalance(doubtSolver)
            newSolverBalance = new web3.utils.BN(newSolverBalance)

            // Find expected Balance
            const expectedBalance = oldSolverBalance.add(amount)

            assert.equal(newSolverBalance.toString(),expectedBalance.toString(),'Contract Balance Checked')
        })
    })

})