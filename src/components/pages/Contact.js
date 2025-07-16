import { EditorInstance } from "../Editor/index";
import { Comment, Numerical } from "../Editor/Elements/CSS";
import { CSS } from "../Editor/CSS";
import NewLine from "../Editor/Elements/Line";
import StickySection from "../Editor/Features/StickyLines/Section";

function Contact() {
	return (
		<EditorInstance>
			<StickySection>
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
						values={[
							[
								"https://www.linkedin.com/in/williambjensen/",
								"url",
							],
						]}
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
			</StickySection>

			<NewLine />

			<StickySection>
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
			</StickySection>

			<NewLine />

			<StickySection>
				<CSS.Rule>
					<CSS.Selector>fun</CSS.Selector>
					<CSS.Declaration
						property="color"
						values={[["00ff00", "color"]]}
					/>
					<CSS.Declaration
						property="font family"
						values={[["Comic Sans", "str"], ["monospace"]]}
						separator=","
					>
						<Comment>Just kidding!</Comment>
					</CSS.Declaration>
					<CSS.Declaration
						property="animation"
						values={[
							["always-learning", null, "animation-name"],
							["1s", "numerical"],
							["infinite", null, "animation-iteration-count"],
						]}
						separator=" "
					/>
					<CSS.Declaration
						property="transform"
						values={[
							[
								["rotate", <Numerical>90deg</Numerical>],
								"function",
							],
						]}
					>
						<Comment>
							I can see things from a different perspective
						</Comment>
					</CSS.Declaration>
				</CSS.Rule>
			</StickySection>
		</EditorInstance>
	);
}

export default Contact;
