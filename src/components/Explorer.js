import React, { useState } from "react";
import ExplorerItemList from "./ExplorerItemList";
import sprite from "../assets/svgs-sprite.svg";
import { portfolioContent } from "../App";

import "../styles/explorer.css";

function Explorer() {
	const [openEditors] = useState(false);
	const [portfolioOpen, setPortfolioOpen] = useState(true);

	return (
		<div className="explorer">
			<div className="exp-top">
				<p className="exp-title">Explorer</p>
				<svg className="exp-dots">
					<use xlinkHref={sprite + "#icon-three-dots"}></use>
				</svg>
			</div>
			<div className="exp-content">
				<div className="exp-item-container">
					<svg
						className="exp-arrow"
						style={
							openEditors ? { transform: "rotate(90deg)" } : {}
						}
					>
						<use href={sprite + "#icon-arrow"} />
					</svg>
					<p>Open Editors</p>
				</div>

				<div
					className="exp-item-container"
					onClick={() => setPortfolioOpen(!portfolioOpen)}
				>
					<svg
						className="exp-arrow"
						style={
							portfolioOpen ? { transform: "rotate(90deg)" } : {}
						}
					>
						<use href={sprite + "#icon-arrow"} />
					</svg>
					<p>Portfolio</p>
				</div>
				{portfolioOpen && (
					<ExplorerItemList listItems={portfolioContent} />
				)}
			</div>
		</div>
	);
}

export default Explorer;
