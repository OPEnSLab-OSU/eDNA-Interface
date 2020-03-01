import {
	h 
} from "preact";

import styled from "@emotion/styled"; 


const ShowcaseBase = styled.div`
	display: grid;
	grid: ${props => props.grid ?? "min-content / min-content"};
	justify-content: center;
	align-content: center;
	height: 100vh;
`;

function Showcase() {
	return (
		<ShowcaseBase>
			{/* <ValveOverview /> */}
		</ShowcaseBase>
	);
}

export default Showcase; 