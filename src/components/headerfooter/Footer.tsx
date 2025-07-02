import React from "react";
import githubLogo from "../../assets/images/github.svg";
import history from "../../utils/createHistory";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full flex items-center justify-between bg-black px-0 py-2.5">
      <a
        href="https://github.com/avik-mandal"
        target="_blank"
        rel="noreferrer"
        className="flex flex-col justify-center w-[50px] mt-[15px] ml-[3vw]"
      >
        <img 
          src={githubLogo} 
          alt="GitHub" 
          className="h-5 w-5 -ml-[3vw]"
        />
      </a>
      <button
        onClick={() => history.push("/feedback")}
        className="btn-primary mx-2.5 my-0 p-1.5 w-auto h-auto"
      >
        Feedback
      </button>
    </footer>
  );
};

export default Footer; 