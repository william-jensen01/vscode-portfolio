import sprite from "../assets/svgs-sprite.svg";
import { ActiveFileContext } from "../Context/ActiveFileContext";
import { useContext } from "react";

import "../styles/header.css";

function Header() {
  const { activeFile } = useContext(ActiveFileContext);

  return (
    <div className="header">
      <div className="hdr-left">
        <button>
          <svg className="hdr-logo">
            <use href={sprite + "#icon-vscode"} />
          </svg>
        </button>
        <button>File</button>
        <button>Edit</button>
        <button>Selection</button>
        <button>View</button>
        <button>Go</button>
        <button>Run</button>
        <button>Terminal</button>
        <button>Help</button>
      </div>
      <div className="hdr-middle">
        <p>
          {activeFile.fileName} - William Jensen
          <span className="vscode"> - Visual Studio Code</span>
        </p>
      </div>
      <div className="hdr-right">
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
