const SERVER_URL = 'http://localhost:3001';

// test

export async function fetchTest() {
    try {
      const response = await fetch(`${SERVER_URL}/api/test`);
      if (!response.ok) throw new Error('Errore nella chiamata API');
      return await response.json();
    } catch (error) {
      console.error('Errore:', error);
      throw error;
    }
  }

  // log in 

  const logIn = async (credentials) => {
    return await fetch(`${SERVER_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    })
    .then(handleInvalidResponse)
    .then(response => response.json())
  }

  // checks if the user is still logged-in
  const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/api/sessions/current', {
      credentials : 'include'
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

// destroys the sessions and executes log-out
const logOut = async() => {
  return await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials : 'include'
  }).then(handleInvalidResponse);
}
// adds a game
async function addGame(game) { 
  return await fetch(SERVER_URL + '/api/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(game),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Errore nella risposta del server');
      }
      return res.json(); 
    })
    .then((data) => {
      console.log('Dati ricevuti:', data); 
      return data;
    })
    .catch((err) => {
      console.error('Errore durante la richiesta:', err);
      throw err;
    });
}

  
  // Update an existing game
  async function updateGame(gameId, updatedGame) {
    try {
        const res = await fetch(SERVER_URL + '/api/games/' + gameId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updatedGame)
        });
        const data = await res.json();
        
        return data;
    } catch (err) {
        console.error('Errore durante la richiesta PUT:', err);
    }
}



  // Objectives API

// Retrieve all objectives
const getAllObjectives = async () => {
  return await fetch(`${SERVER_URL}/api/objectives`)
  
  .then(handleInvalidResponse)
  .then(response => response.json())
  .catch((err) => {
      console.error('Errore durante il recupero degli obiettivi:', err);
      throw err;
  });
};

// Retrieve an objective by its ID
const getObjectiveById = async (id) => {
  return await fetch(`${SERVER_URL}/api/objectives/${id}`, {
      credentials: 'include'
  })
  .then(handleInvalidResponse)
  .then(response => response.json())
  .catch((err) => {
      console.error(`Errore durante il recupero dell'obiettivo con ID ${id}:`, err);
      throw err;
  });
};

async function getUserGoals(userId) {
  try {
      const res = await fetch(`${SERVER_URL}/api/users/${userId}/goals`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'include', 
      });

      
      if (!res.ok) {
          throw new Error(`Errore nel recupero dei goal: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      return data;
  } catch (err) {
      console.error('Errore durante la richiesta GET:', err.message);
      return null; 
  }
}

function handleInvalidResponse(response) {
  if (!response.ok) { throw Error(response.statusText) }
  let type = response.headers.get('Content-Type');
  if (type !== null && type.indexOf('application/json') === -1){
      throw new TypeError(`Expected JSON, got ${type}`)
  }
  return response;
}

const API = { logIn,
  getUserInfo,
  logOut,
  addGame,
  updateGame,
  getAllObjectives,
  getObjectiveById,
  getUserGoals
};


export default API;