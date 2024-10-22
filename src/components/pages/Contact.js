import {
	EditorInstance,
	Comment,
	OpenParen,
	CloseParen,
	Numerical,
} from "../Editor/index";
import { CSS } from "../Editor/CSS";

function Contact() {
	return (
		<EditorInstance>
			<CSS>
				<CSS.Rule>
					<CSS.Selector>contact-me</CSS.Selector>
					<CSS.Declaration
						property={"email"}
						values={[["williambjensen01@gmail.com", "str"]]}
					></CSS.Declaration>
					<CSS.Declaration
						property="github"
						values={[["https://github.com/wiliam-jensen01", "url"]]}
					>
						<Comment>click to open</Comment>
					</CSS.Declaration>
					<CSS.Declaration
						property="linkedIn"
						values={[["https://www.linkedin.com/in/williambjensen/", "url"]]}
					>
						<Comment>click to open</Comment>
					</CSS.Declaration>
					<CSS.Declaration
						property="location"
						values={[["Saratoga Springs, Utah", "str"]]}
					/>
					<CSS.Declaration
						property="preferred contact method"
						values={[["email", "str"]]}
					></CSS.Declaration>
				</CSS.Rule>
				<CSS.Rule>
					<CSS.Selector>status</CSS.Selector>
					<CSS.Declaration
						property="current project"
						values={[["updating portfolio", "str"]]}
					/>
					<CSS.Declaration
						property="learning next"
						values={[["GraphQL", "str"]]}
					/>
					<CSS.Declaration
						property="open to opportunities"
						values={[["true"]]}
					/>
				</CSS.Rule>
				<CSS.Rule>
					<CSS.Selector>fun</CSS.Selector>
					<CSS.Declaration property="color" values={[["00ff00", "color"]]} />
					<CSS.Declaration
						property="font family"
						values={[["Comic Sans", "str"], ["monospace"]]}
						separator=", "
					>
						<Comment>Just kidding!</Comment>
					</CSS.Declaration>
					<CSS.Declaration
						property="animation"
						values={[["always-learning"], ["1s", "numerical"], ["infinite"]]}
					/>
					<CSS.Declaration
						property="transform"
						values={[
							[
								<span style={{ color: "var(--css-value)" }}>
									rotate
									<OpenParen />
									<Numerical>90deg</Numerical>
									<CloseParen />
								</span>,
							],
						]}
					>
						<Comment>I can see things from a different perspective</Comment>
					</CSS.Declaration>
				</CSS.Rule>
			</CSS>
		</EditorInstance>
	);
}

export default Contact;
