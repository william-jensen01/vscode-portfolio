import Codebar from "../Codebar";

import "../../styles/contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <Codebar amount={8} type="ct" />
      <div className="contact">
        <p className="ct-css-selector">
          <span className="ct-css-name">.contact-me </span>
          <span className="ct-css-bracket">{`{`}</span>
        </p>
        <p className="ct-css-line">
          email:{" "}
          <span className="ct-css-value">williambjensen01@gmail.com</span>;
        </p>
        <p className="ct-css-line">
          github:{" "}
          <span>
            <a
              href="https://github.com/william-jensen01"
              target="_blank"
              rel="noopener noreferrer"
              className="ct-css-value"
            >
              https://github.com/william-jensen01
            </a>
          </span>
          ;
        </p>
        <p className="ct-css-line">
          linkedin:{" "}
          <span>
            <a
              href="https://www.linkedin.com/in/williambjensen/"
              target="_blank"
              rel="noopener noreferrer"
              className="ct-css-value"
            >
              https://www.linkedin.com/in/williambjensen/
            </a>
          </span>
          ;
        </p>
        <p className="ct-css-line">
          twitter:{" "}
          <span>
            <a
              href="https://twitter.com/wbjensen"
              target="_blank"
              rel="noopener noreferrer"
              className="ct-css-value"
            >
              https://twitter.com/wbjensen
            </a>
          </span>
          ;
        </p>
        <p className="ct-css-line">
          location:{" "}
          <span className="ct-css-value">
            <span className="ct-css-quote">"</span>Salt Lake City, UT
            <span className="ct-css-quote">"</span>
          </span>
          ;
        </p>
        <p className="ct-css-bracket">{`}`}</p>
      </div>
    </div>
  );
}

export default Contact;
