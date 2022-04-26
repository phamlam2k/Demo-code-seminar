import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useRef, useState } from "react";
import useContract from "../../hooks/useContract";

const HomeScreen = () => {
  const [info, setInfo] = useState();
  const { getBalanceOf, transfer } = useContract();
  const valAddress = useRef();
  const valAddressReceive = useRef();
  const valAmount = useRef();

  const handleConnect = async () => {
    if (window.ethereum) {
      const providers = new ethers.providers.Web3Provider(window.ethereum);

      await providers.send("eth_requestAccounts", []);

      const signer = providers.getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();
      setInfo({ address, chainId, signer });
    } else {
      console.log("Vui long tai metamask");
    }
  };

  const handleDisconnect = async () => {
    if (
      window.ethereum._handleDisconnect &&
      typeof window.ethereum.handleDisconnect
    ) {
      await window.ethereum._handleDisconnect();
      setInfo({});
      window.location.reload();
    }
  };

  useEffect(() => {
    try {
      if (window.ethereum) {
        const { ethereum } = window;
        const handleAccountsChanged = (accounts) => {
          setInfo((prev) => ({ ...prev, address: accounts[0] }));
        };

        const handleChainChanged = (_hexChainId) => {
          setInfo((prev) => ({
            ...prev,
            chainId: BigNumber.from(_hexChainId).toNumber(),
          }));
        };

        const handleDisconnect = () => {
          void handleDisconnect();
        };

        ethereum.on("accountsChanged", handleAccountsChanged);
        ethereum.on("chainChanged", handleChainChanged);
        ethereum.on("disconnect", handleDisconnect);

        return () => {
          if (ethereum?.removeListener) {
            ethereum.removeListener("accountsChanged", handleAccountsChanged);
            ethereum.removeListener("chainChanged", handleChainChanged);
            ethereum.removeListener("disconnect", handleDisconnect);
          }
        };
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleBalanceOf = async () => {
    const balanc = await getBalanceOf(valAddress?.current?.value, info?.signer);

    console.log(formatEther(BigNumber.from(balanc).toString()));
  };

  const handleTransfer = async () => {
    const transferToken = await transfer(
      valAddressReceive?.current?.value,
      formatEther(valAmount?.current?.value),
      info?.signer
    );

    console.log(transferToken);
  };

  return (
    <div>
      {info?.address ? (
        <div>
          <div>Address: {info?.address}</div>
          <div>Chain ID: {info?.chainId}</div>
          <button onClick={handleDisconnect}>disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>connect</button>
      )}
      <div>
        <h3>Get Balance of address:</h3>
        <input ref={valAddress} />
        <button onClick={handleBalanceOf}>Get Balance</button>
      </div>
      <div>
        <h3>Transfer: </h3>
        <input ref={valAddressReceive} />
        <input ref={valAmount} />
        <button onClick={handleTransfer}>Transfer</button>
      </div>
    </div>
  );
};

export default HomeScreen;
