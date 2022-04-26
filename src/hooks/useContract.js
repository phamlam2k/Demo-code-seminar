import { ethers } from 'ethers'
import ContractABI from '../contract/index.json'

const useContract = () => {
	const contractAdress = '0x6d379f759770d6b7b1942A68186ff4AD9D127a4A'

  const transfer = async (address, amount, signers) => {
		try {
			const contract = new ethers.Contract(contractAdress, ContractABI, signers)
	
			const data = await contract.transfer(address, amount)
	
			return data
		} catch (err) {
			console.log(err)
		}
	}

	const getBalanceOf = async (address, signers) => {
		try {
			const contract = new ethers.Contract(contractAdress, ContractABI, signers)

			const data = await contract.balanceOf(address)

			return data
		} catch (err) {
			console.log(err)
		}
	}

	return { transfer, getBalanceOf }
}

export default useContract