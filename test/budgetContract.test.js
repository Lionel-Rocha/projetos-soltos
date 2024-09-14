const { expect, use } = require('chai');
const { ethers } = require('ethers');
const { deployContract, MockProvider, solidity } = require('ethereum-waffle');
const budgetContract = require('../build/budgetContract.json');


use(solidity);

describe('Contract', () => {
    const [wallet, walletTo, walletOther] = new MockProvider().getWallets();
    let contract;

    beforeEach(async () => {
        contract = await deployContract(wallet, budgetContract, []);
        const data = ethers.utils.formatBytes32String("Budget One");
        const value = ethers.utils.parseEther('1');

        await contract.storeBudget(data, value); //initial mock budget

    });

    it("Should store a budget", async () => {
        const data = ethers.utils.formatBytes32String("Budget Two");
        const value = ethers.utils.parseEther('2');

        await expect(contract.storeBudget(data, value))
            .to.emit(contract, 'BudgetStored')
            .withArgs(1, wallet.address, value);

        const stored = await contract.getBudget(1);

        expect(stored[0]).to.equal(data);
        expect(stored[1]).to.equal(value);
        expect(stored[2]).to.equal(wallet.address);
        expect(stored[3]).to.equal(false);
    });

    it("Should allow to pay a budget", async() => {

        const budget = await contract.getBudget(0)
        const value = budget[1];

       await expect(contract.connect(walletTo).payBudget(0, {value: value}))
           .to.emit(contract, "BudgetPaid")
           .withArgs(0, walletTo.address, value);

        const stored = await contract.getBudget(0);
        expect(stored[3]).to.equal(true);
    });

    it("Should not allow paying an incorrect amount", async () => {
        await expect(contract.connect(walletTo).payBudget(0, {value: 7}))
            .to.be.revertedWith('Incorrect value sent');

        const stored = await contract.getBudget(0);
        expect(stored[3]).to.equal(false);
    });

    it("Should not allow budget owner to pay their own budget", async () => {
        const budget = await contract.getBudget(0)
        const value = budget[1];

        await expect(contract.connect(wallet).payBudget(0, {value: value}))
            .to.be.revertedWith('Owner can\'t pay their own budget');

        const stored = await contract.getBudget(0);
        expect(stored[3]).to.equal(false);
    });

    it("Should not allow paid budget to be paid again", async() => {
        const budget = await contract.getBudget(0)
        const value = budget[1];

        await expect(contract.connect(walletTo).payBudget(0, {value: value}))
            .to.emit(contract, "BudgetPaid")
            .withArgs(0, walletTo.address, value);

        await expect(contract.connect(walletOther).payBudget(0, {value: value}))
            .to.be.revertedWith('Budget already paid');
    });

    it("Should return budget mapping size", async() => {
        const size = await contract.getBudgetLength();
        expect(size).to.equal(1);
    });

    it("Should return budget by address", async () => {
        const wallet_address = await wallet.getAddress();
        const budget_id = parseInt(await contract.getBudgetsByAddress(wallet_address));
        const budget = await contract.getBudget(budget_id);
        const address = budget[2];

        expect(address).to.equal(wallet_address);
    });

    it("Shouldn't return non-existing budget", async() => {
        await expect(contract.getBudget(100))
            .to.be.revertedWith("Invalid budget ID")
    })

});

