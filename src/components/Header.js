import sprite from "./assets/svgs-sprite.svg";
import { ActiveFileContext } from "../Context/ActiveFileContext";
import { useContext } from "react";

import "../styles/header.css";

function Header() {
  const { activeFile } = useContext(ActiveFileContext);

  return (
    <div className="header">
      <div className="hdr-left">
        <svg className="hdr-logo">
          <use href={sprite + "#icon-vscode"} />
        </svg>
        <p>File</p>
        <p>Edit</p>
        <p>Selection</p>
        <p>View</p>
        <p>Go</p>
        <p>Run</p>
        <p>Terminal</p>
        <p>Help</p>
      </div>
      <div className="hdr-middle">
        <p>{activeFile.fileName} - William Jensen - Visual Studio Code</p>
      </div>
      <div className="hdr-right">
        <p></p>
        <svg className="hdr-icon">
          <use href={sprite + "#icon-minimize"} />
        </svg>
        <svg className="hdr-icon">
          <use href={sprite + "#icon-maximize"} />
        </svg>
        <svg className="hdr-icon hdr-icon-close">
          <use href={sprite + "#icon-close"} />
        </svg>
      </div>
    </div>
  );
}

export default Header;
