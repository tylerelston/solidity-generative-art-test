async function main() {
    const [owner, person] = await ethers.getSigners();
    const auctionContractFactory = await hre.ethers.getContractFactory("Auction");
    const auctionContract = await auctionContractFactory.deploy();
    await auctionContract.deployed();
    console.log("Deployed to", auctionContract.address);
    console.log("Contract deployed by: ", owner.address);

    let interestedCount;
    let interestedTxn;

    // calls from contract owner
    await auctionContract.getInterested();
    interestedTxn = await auctionContract.interested();
    await interestedTxn.wait();
    interestedTxn = await auctionContract.interested();
    await interestedTxn.wait();

    // call from person
    interestedTxn = await auctionContract.connect(person).interested();
    await interestedTxn.wait();

    interestedTxn = await auctionContract.notInterested();
    await interestedTxn.wait();

    interestedCount = await auctionContract.getInterested();

    // leave message

    let messageTxn;
    messageTxn = await auctionContract.message("Message one");
    await messageTxn.wait();

    messageTxn = await auctionContract.message("Message two");
    await messageTxn.wait();

    let allMessages = await auctionContract.getAllMessages();
    console.log(allMessages);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })