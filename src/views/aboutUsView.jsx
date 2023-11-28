import React from 'react';
import "/src/aboutUs.css";
import { Link } from 'react-router-dom';

const AboutUsView = () => {
  return (
    <div className='full-screen bg-about'>
      <h1>About Us</h1>
      <p>If you are intrested and want to learn more about our project, please visit our git-repository:</p>
      <a href="https://github.com/RazanYakoub01/PokeCollect_DH2642">
        GitHub
      </a>
      <h2>Contributors:</h2>
      <div className="contributor">
      <img src="src/aboutUsImages/temp1.png"/>
      <p>Text about Contributor 1</p>
      </div>
      <div className="contributor">
      <img src="src/aboutUsImages/temp1.png"/>
      <p>Text about Contributor 2</p>
      </div>
      <div className="contributor">
      <img src="src/aboutUsImages/temp2.jpg"/>
      <p>Text about Contributor 3</p>
      </div>
      <div className="contributor">
      <img src="src/aboutUsImages/temp2.jpg"/>
      <p>Text about Contributor 4</p>
      </div>
    </div>
  );
};

export default AboutUsView;