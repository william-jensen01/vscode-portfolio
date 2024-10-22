import React from "react";

export function NewLine({ children, indent, ...props }) {
	return (
		<div className="line">
			<div className="view-number" />
			<div className={`view-line ${indent ? "indent" : ""}`} {...props}>
				{children}
			</div>
		</div>
	);
}
/* 
<<==
*/
export function LineNumbers({ children, ...props }) {
	return (
		children && (
			<div className={`counter ${props.className}`}>
				{React.Children.map(children, (child, idx) => (
					<NewLine key={`line #${idx}`}>
						{React.cloneElement(child, {
							style: { ...child.props.style },
						})}
					</NewLine>
				))}
			</div>
		)
	);
}

/* content */
export function Comment({ children, content }) {
	return children ? (
		React.Children.map(children, (child) => (
			<span className="comment">{` /* ${child} */`}</span>
		))
	) : content ? (
		<span className="comment">{` /* ${content} */`}</span>
	) : (
		new Error("No children or content provided.")
	);
}

// ;
export function SemiColon() {
	return <span className="semicolon">&#59;</span>;
}

// (
export function OpenParen() {
	return (
		<span className="parenthesis" data-symbol="(">
			&#40;
		</span>
	);
}

// )
export function CloseParen() {
	return (
		<span className="parenthesis" data-symbol=")">
			&#41;
		</span>
	);
}

// {
export function OpenCurlyBrace(props) {
	return (
		<span className={`brace ${props.css ? "css" : ""}`} data-symbol="{">
			&#123;
		</span>
	);
}

// }
export function CloseCurlyBrace(props) {
	return (
		<span className={`brace ${props.css ? "css" : ""}`} data-symbol="}">
			&#125;
		</span>
	);
}

// :
export function Colon() {
	return (
		<span className="colon" data-symbol=":">
			&#58;
		</span>
	);
}

// #
export function Hash() {
	return (
		<span className="hash" data-symbol="#">
			&#35;
		</span>
	);
}

// "content"
export function Quotation({ children, content }) {
	return children ? (
		React.Children.map(children, (child) => (
			<span className="quotation">"{child}"</span>
		))
	) : content ? (
		<span className="quotation">"{content}"</span>
	) : (
		new Error("No children or content provided.")
	);
}

// url(link)
export function Url({ children, link }) {
	return children ? (
		React.Children.map(children, (child) => (
			<>
				<span className="url">url</span>
				<OpenParen />
				<a href={child} target="_blank" rel="noopener noreferrer">
					<Quotation>{child}</Quotation>
				</a>
				<CloseParen />
			</>
		))
	) : link ? (
		<>
			<span className="url">url</span>
			<OpenParen />
			<a href={link} target="_blank" rel="noopener noreferrer">
				<Quotation>{link}</Quotation>
			</a>
			<CloseParen />
		</>
	) : (
		new Error("No children or content provided.")
	);
}

export function ColorPreview({ children, hex }) {
	const renderColor = (color) => {
		let formattedColor = color;
		if (color[0] !== "#") {
			formattedColor = `#${color}`;
		}
		return (
			<div className="color-preview">
				<input type="color" value={formattedColor} />
				<span style={{ backgroundColor: formattedColor }}>
					{formattedColor}
				</span>
			</div>
		);
	};

	return children
		? React.Children.map(children, (child) => renderColor(child))
		: hex
		? renderColor(hex)
		: new Error("No children or content provided.");
}

export function Numerical({ children, value }) {
	return children ? (
		React.Children.map(children, (child) => (
			<span className="numerical">{child}</span>
		))
	) : value ? (
		<span className="numerical">{value}</span>
	) : (
		new Error("No children or content provided.")
	);
}

export function Group({ children }) {
	const childrenArray = React.Children.toArray(children);
	const parent = childrenArray.find((child) => child.type === Group.Parent);
	const body = childrenArray.find((child) => child.type === Group.Body);
	return (
		<div className="group">
			{parent && <span className="group-parent">{parent}</span>}
			{body && <div className="group-body">{body}</div>}
		</div>
	);
}
Group.Body = ({ children }) => children;

export function EditorInstance({ children }) {
	return (
		<div className="editor-instance">
			{children}
			<NewLine>
				<span id="caret" />
			</NewLine>
		</div>
	);
}
