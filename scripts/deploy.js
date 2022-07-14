const main = async () => {
  const colexionContractFactory = await hre.ethers.getContractFactory('Colexion');
  const colexionContract = await colexionContractFactory.deploy();

  await colexionContract.deployed();
  console.log("Contract deployed to:", colexionContract.address);

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();