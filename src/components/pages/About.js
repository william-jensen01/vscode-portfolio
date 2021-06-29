import resume from "../assets/resume.pdf";
import underline from "../assets/underline-white.png";

import "../../styles/about.css";

function About() {
  return (
    <div className="about">
      <h1>William Jensen</h1>
      <h3>
        Software Developer{" "}
        <img src={underline} alt="white underline" className="ab-underline" />
      </h3>
      <img
        src="https://pbs.twimg.com/profile_images/1403597949058363393/qrSQMWaG_400x400.jpg"
        alt="William Jensen"
        className="ab-pic"
      />
      <p>
        Hello there! I'm William, an aspiring Full Stack Software Developer that
        recently graduated from Lambda School. My passion for code didn't start
        until high school where I took multiple web design and computer science
        classes at Utah Valley University. Shortly after graduating with my
        associates, I was admited into Lambda School, a 6+ month computer
        science & software engineering academy that gave me hands on experience.
        Now, I am looking for opportunities that will challenge me to grow and
        learn.
      </p>
      <a
        href={resume}
        target="_blank"
        rel="noopener noreferrer"
        alt="resume"
        className="resume"
      >
        Resume
      </a>
    </div>
  );
}

export default About;