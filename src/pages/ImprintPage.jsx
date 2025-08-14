import React from 'react';

const ImprintPage = () => {
  return (
    <div style={{ fontFamily: 'Arial', color: '#ffffff', backgroundColor: '#000000', padding: '20px' }}>
      <h1 style={{ fontSize: '26px' }}>IMPRINT</h1>
      
      <p>
        Muhammed Kagan Yilmaz<br />
        Aroser Allee 50<br />
        13407 Berlin<br />
        Germany
      </p>

      <h2 style={{ fontSize: '17px', marginTop: '20px' }}>Contact Information:</h2>
      <p>
        Phone: (+49) +49 01784248372<br />
        Email: <a href="mailto:karlbostik@gmail.com" style={{ color: '#3030F1' }}>karlbostik@gmail.com</a>
      </p>

      <h2 style={{ fontSize: '17px', marginTop: '20px' }}>Authorized Representative:</h2>
      <p>Muhammed Kagan Yilmaz</p>
    </div>
  );
};

export default ImprintPage;
