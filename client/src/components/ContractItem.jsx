import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { FaMoneyBillAlt, FaAddressCard } from 'react-icons/fa'
import { BsCardHeading } from 'react-icons/bs'
import { GrStatusInfo } from 'react-icons/gr'
import axios from 'axios';

const Label = styled.label`
	font-weight: bold;
    font-size: 1.1em;
    font-family: Georgia, serif;
`;

const ContractItem = ({doubt}) => {

    const [price, setPrice] = useState(0)

    useEffect(() => {
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	})

	return (
		<div>
			<div className="row">
				<br/>
			</div>
			<div className="row">
				<div className="col-2"/>
				<div className="card mb-3 col-8">
                    <br />
					<div>
						<div className="mb-3">
							<Label>Title <BsCardHeading/></Label>
							<div>
								{ doubt.title }
							</div>
						</div>
						<div className="mb-3">
							<Label>Status <GrStatusInfo/></Label>
							<div>
								{ doubt.description }
							</div>
						</div>
                        <div className="mb-3">
							<Label>Address Of Doubt Asker <FaAddressCard/></Label>
							<div>
								{ doubt.addressOfDoubtResolver }
							</div>
						</div>
                        <div className="mb-3">
							<Label>Address Of Doubt Solver <FaAddressCard/></Label>
							<div>
								{ doubt.addressOfDoubtSolver }
							</div>
						</div>
						<div className="mb-3">
							<Label>Amount <FaMoneyBillAlt/></Label>
							<div>{ doubt.raisedAmount/10**18 } ETH (Rs. {price*doubt.raisedAmount/10**18})</div>
						</div>
                        <br />
					</div>
				</div>
			</div>
		</div>
	)
}

export default ContractItem
