import React, { useEffect, useState } from 'react';
import API from '../API';

const ObjectiveList = () => {
  const [obiettivi, setObiettivi] = useState([]);

  useEffect(() => {
    API.getAllObjectives()  
    .then(data => {
      
      setObiettivi(data); 
    })
    .catch(err => console.error('Errore nel recuperare gli obiettivi', err));
}, []);

return (
  <div className="container mt-4">
    <h2 className="text-center mb-4" style={{ fontSize: '2.5rem' , paddingTop: '2em'}}>Scopri gli obiettivi da raggiungere!</h2>
    {obiettivi.length === 0 ? (
      <p className="text-center">Nessun obiettivo disponibile</p>
    ) : (
      <div>
      
        <ul className="list-unstyled">
          {obiettivi.map(obiettivo => {
            let imageSrc;

            // l'icona è un Buffer, la convertiro in Base64
            if (obiettivo.icon && obiettivo.icon.type === 'Buffer') {
              const base64String = btoa(
                String.fromCharCode(...obiettivo.icon.data)
              );
              imageSrc = `data:image/png;base64,${base64String}`;
            } else {
              imageSrc = obiettivo.icon;
            }

            return (
              <li key={obiettivo.id} className="mb-4 d-flex align-items-center">
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={obiettivo.name}
                    style={{ width: 50, height: 50, marginRight: '1rem' }}
                  />
                )}
                <div>
                  <h4 className="mb-1">{obiettivo.name}</h4>
                  <p>{obiettivo.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    )}
  </div>
);


};

export default ObjectiveList;