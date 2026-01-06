// imports
import express from 'express';
import cors from 'cors'; 
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';     
import UserDao from './dao/dao-users.mjs';
import GameDao  from './dao/dao-games.mjs';
import Game from './Game.mjs';
import ObjectivesDao from './dao/dao-objectives.mjs';
import cookieParser from 'cookie-parser';
import UserGoalsDao, {updateUserObjectives} from './dao/dao-user_goals.mjs';
import { check, validationResult } from 'express-validator';

const userDao = new UserDao()
const gameDao = new GameDao()
const objectivesDao = new ObjectivesDao()
const userGoalsDao = new UserGoalsDao()


// init express
const app = new express();
app.use(morgan('dev'))
app.use(express.json())


/***** (CORS) *****/
const corsOptions ={
  origin: 'http://localhost:5173',
  credentials: true,
  cookie: { secure: false }
}

app.use(cors(corsOptions))
app.use(cookieParser());

/*** Passport ***/

passport.use(
  
  new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password)
    

    if(!user)
      return callback(null, false, 'Incorrect username or password');

    return callback(null, user); 
}));

// Serializing the session
passport.serializeUser(function (user, callback) { // this user is id + username + name

   callback(null, user);
});

// extracting the current user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name
  
  return callback(null, user); // this will be available in req.user

});

/** Creating the session */

app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
})
);
app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('session'));

/***** APIs *****/
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test successful' });
});

/** auth check **/
const isLoggedIn = (req, res, next) => {
  
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}
app.use((req, res, next) => {
  res.cookie('example', 'value', { httpOnly: true });


  next();
});

/***** Users APIs *****/
// POST /api/session
// This route is used for the login
app.post('/api/sessions', function(req, res, next) {

  passport.authenticate('local', (err, user, info) => {
    if (err){
      console.error('Errore durante l\'autenticazione:', err);
      return next(err);}
      if (!user) {
        console.warn('Autenticazione fallita, nessun utente trovato:', info);
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err){
          console.error('Errore durante il login:', err);
          return next(err);
        }
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUserByCredentials() in LocalStratecy Verify Function
     
        return res.json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {

      res.status(200).json(req.user);}
    else
    {console.warn('Utente non autenticato');
      res.status(401).json({error: 'Not authenticated'});}
  });

  // DELETE /api/session/current
  // This route is used for loggin out the current user.
  app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
      res.end();
    });
  });

  
/************************* Games APIs *************************/

const gameValidation = [
  check('difficulty').isInt({ min: 1, max: 4 }).withMessage('Difficulty must be between 1 and 4'),
  check('attempts').optional().isInt({ min: 0 }).withMessage('Attempts must be a non-negative integer'),
  check('game_status').optional().isIn(['in_progress', 'won', 'lost']).withMessage('Game status must be "in_progress", "won", or "lost"'),
  check('randomNumber').optional().isInt({ min: 1 }).withMessage('Random number must be greater than or equal to 1')
];

// Create a new game,
// POST /api/games
app.post('/api/games', isLoggedIn, async (req, res) => {
  const invalidFields = validationResult(req);
  
  if (!invalidFields.isEmpty()) {
    return res.status(422).json({ validationErrors: invalidFields.array() });
  }

  console.log('Body della richiesta ricevuta:', req.body);
  

  const userId = req.user.id;

  // Validazione e default
  let difficulty = parseInt(req.body.difficulty);
  difficulty = Number.isInteger(difficulty) && difficulty >= 1 && difficulty <= 4 ? difficulty : 1;

  const attempts = Number.isInteger(req.body.attempts) && req.body.attempts >= 0 ? req.body.attempts : 0;
  const maxAttempts = 4 * difficulty;

  let gameStatus = req.body.game_status || 'in_progress';
  if (attempts >= maxAttempts && gameStatus !== 'won') {
      gameStatus = 'lost';
  }

  const randomNumber = Math.floor(Math.random() * Math.pow(10, difficulty)) + 1;

  const game = new Game(undefined, userId, difficulty, attempts, randomNumber, gameStatus);

  try {
      const result = await gameDao.addGame(game);
      
      res.json(result);
  } catch (err) {
      console.error('Errore durante la creazione del gioco:', err);
      res.status(503).json({ error: `Database error: ${err.message}` });
  }
});
// Retrieves all games,
// GET /api/games
app.get('/api/games', isLoggedIn, async (req, res) => {
  
  try {
      const games = await gameDao.getAllGames();
      res.json(games);
  } catch (err) {
      console.error('Errore durante il recupero dei giochi:', err);
      res.status(503).json({error: `Errore nel recupero dei giochi: ${err}`});
  }
});


// Update a game,
// PUT /api/game/:id
app.put('/api/games/:id', isLoggedIn, async (req, res) => {
  const invalidFields = validationResult(req);
  
  if (!invalidFields.isEmpty()) {
    return res.status(422).json({ validationErrors: invalidFields.array() });
  }
  const gameId = req.params.id;
  const gameUpdates = req.body; // i nuovi dati per il gioco
  
  try {
      const updatedGame = await gameDao.updateGame(gameId, gameUpdates);
      await updateUserObjectives(req.user.id);
      res.json(updatedGame);
  } catch (err) {
      console.error('Errore durante l\'aggiornamento del gioco:', err);
      res.status(503).json({error: `Errore durante l'aggiornamento del gioco: ${err}`});
  }
});



/************************* Objectives APIs *************************/

// get all ojbectives
// GET /api/objectives
app.get('/api/objectives', async (req, res) => {
  try {
      const objectives = await objectivesDao.getAllObjectives();
      
      res.status(200).json(objectives);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving objectives' });
  }
});

// Get an objective give its id
// GET /api/objectives/:id
app.get('/api/objectives/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
      const objective = await objectivesDao.getObjectiveById(id);
      if (objective.error) {
          res.status(404).json(objective);
      } else {
          res.status(200).json(objective);
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving the objective' });
  }
});


/************************* dao-users APIs *************************/

// Get a specific user goal by userId and goalId
// GET /api/users/:userId/goals/:goalId
app.get('/api/users/:userId/goals/:goalId', async (req, res) => {
  const { userId, goalId } = req.params;
  const { count } = req.body;

  if (count === undefined || typeof count !== 'number' || count < 0) {
    return res.status(400).json({ error: 'Invalid count value' });
  }
  try {
      const goal = await userGoalsDao.getUserGoal(userId, goalId);
      res.status(200).json(goal);
     
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving the goal' });
  }
});
// Get all user goals by userId 
// GET /api/users/:userId/goals
app.get('/api/users/:userId/goals', async (req, res) => {
  const { userId } = req.params;
  try {
      const goals = await userGoalsDao.getUserGoals(userId); 
     

      if (goals && goals.length > 0) { 
          res.status(200).json(goals); 
      } else {
          res.status(404).json({ error: 'No Goals found' }); 
      }
  } catch (err) {
      console.error(err); 
      res.status(500).json({ error: 'Error retrieving the goals' });
  }
})
// Update a specific user goal
// PUT /api/users/:userId/objectives/:objective
app.put('/api/users/:userId/goals/:goalId', async (req, res) => {
  const { userId, goalId } = req.params;
  const { count } = req.body;

  if (count === undefined) {
      return res.status(400).json({ error: 'Count is required' });
  }

  try {
      const goal = await userGoalsDao.getUserGoal(userId, goalId);
      if (goal) {
          await userGoalsDao.updateGoalCount(userId, goalId, count);
          res.status(200).json({ message: 'Goal updated successfully' });
      } else {
          res.status(404).json({ error: 'Goal not found' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating the goal' });
  }
});
// Create a new user goal
// POST /api/users/:userId/goals
app.post('/api/users/:userId/goals/:goalId', async (req, res) => {
  const { userId } = req.params;
  const { goalId, count } = req.body;

  if (!goalId || count === undefined) {
      return res.status(400).json({ error: 'goalId and count are required' });
  }

  try {
      const lastID = await userGoalsDao.addUserGoal(userId, goalId, count);
      res.status(201).json({ id: lastID, userId, goalId, count });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error creating the goal' });
  }
});
// Delete a specific user goal
// DELETE /api/users/:userId/goals/:goalId
app.delete('/api/users/:userId/goals/:goalId', async (req, res) => {
  const { userId, goalId } = req.params;

  try {
      const goal = await userGoalsDao.getUserGoal(userId, goalId);
      if (goal) {
          // Delete the goal from the database
          const changes = await userGoalsDao.deleteGoal(userId, goalId);
          if (changes > 0) {
              res.status(200).json({ message: 'Goal deleted successfully' });
          } else {
              res.status(404).json({ error: 'Goal not found' });
          }
      } else {
          res.status(404).json({ error: 'Goal not found' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting the goal' });
  }
});


// activate the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
