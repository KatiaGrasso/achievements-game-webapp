import db from "../db.mjs";
import ObjectivesDao from "./dao-objectives.mjs";
import GameDao from "./dao-games.mjs";
/************** User_goals DAO **************/


export default function UserGoalsDao() {

  

    // retrieve a goal
    this.getUserGoal = (userId, goalId) => {
        return new Promise((resolve, reject) => {
            const query = ` SELECT *  FROM user_goals
                WHERE user_id = ? AND goal_id = ?`;

            db.get(query, [userId, goalId], (err, row) => {
                if (err) {
                    return reject(err); 
                }
                resolve(row); 
            });
        });
    },

     // retrieve all goals
     this.getUserGoals = (userId) => {
        return new Promise((resolve, reject) => {
           
            
            const query = ` SELECT *  FROM user_goals
                WHERE user_id = ?`;
                

            db.all(query, [userId], (err, rows) => {
                if (err) {
                    return reject(err); 
                }
                resolve(rows); 
            });
        });
    },
    // update a goal
    this.updateGoalCount = (userId, goalId, newCount) => {
        return new Promise((resolve, reject) => {
           
            const query = `UPDATE user_goals SET count = ?
                WHERE user_id = ? AND goal_id = ?`;

            db.run(query, [ newCount, userId, goalId,], function (err) {
                if (err) {
                    return reject(err); 
                }
                resolve(this.changes); 
            });
        });
    },

  // create a goal
  this.addUserGoal = (userId, goalId, count) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO user_goals (user_id, goal_id, count)
                VALUES (?, ?, ?)`;

            db.run(query, [userId, goalId, count], function (err) {
                if (err) {
                    return reject(err); 
                }
                resolve(this.lastID); 
            });
        });
    }

};


export const updateUserObjectives = async (userId) => {
    
    const objectivesDao = new ObjectivesDao()
    const userGoalsDao = new UserGoalsDao()

    const gameDao = new GameDao()
    try {
        const objectives = await objectivesDao.getAllObjectives(); 
        const games = await gameDao.getAllGames(); 
       
        for (let objective of objectives) {
            let isAchieved = false;

            switch (objective.id) {

                case 1: // Benvenuto
                    //Prima partita giocata                    
                    isAchieved = games.some(game => game.user_id === userId);
                    break;

                case 2: // Primi passi
                    // Prima partita vinta
                    const firstWin = games.some(game => game.user_id === userId && game.game_status === 'won');
                    isAchieved = firstWin;
                    break;

                case 3: // Non Mollare!
                    // Prima partita persa
                    isAchieved = games.some(game => game.user_id === userId && game.game_status === 'lost');
                    break;

                case 4: // Maratoneta
                    // Completa 20 partite totali
                    const totalGames = games.filter(game => game.user_id === userId).length;
                    isAchieved = totalGames % 20 === 0 && totalGames > 0; // Verifica multipli di 20
                    break;

                case 5: // Esordio vincente!
                    // Vinci a difficoltà 1
                    const winsAtDifficulty1 = games.filter(game => game.user_id === userId && game.difficulty === 1 && game.game_status === 'won');
                    isAchieved = winsAtDifficulty1.length === 1; 

                    break;

                case 6: // Leggenda in Ascesa
                    // 10 vittorie a difficoltà 2
                    const winsAtDifficulty2 = games.filter(game => game.user_id === userId && game.difficulty === 2 && game.game_status === 'won').length;
                    isAchieved = winsAtDifficulty2 > 0 && winsAtDifficulty2 % 10 === 0;
                    break;


                case 7: // Serie Perfetta
                    // 5 vittorie consecutive a difficoltà 3
                    const consecutiveWins = games.filter(game => game.user_id === userId && game.difficulty === 3 && game.game_status === 'won').length;
                    isAchieved = consecutiveWins % 5 === 0 && consecutiveWins > 0; // Verifica multipli di 5
                    break;

                case 8: // Indovino Perfetto
                    // Numero segreto scoperto al primo colpo
                    const perfectGuesses = games.filter(game => game.user_id === userId && game.game_status === 'won' && game.attempts <2);
                    isAchieved = perfectGuesses.length > 0;
                    break;

                case 9: // Tentativi d'Oro
                    // Tentativi < 50% a difficoltà 3 e 4
                    isAchieved = games.some(game => game.user_id === userId && (game.difficulty === 3 || game.difficulty === 4) && game.game_status === 'won' && game.attempts < (game.difficulty * 4) / 2);
                    break;

                case 10: // Fortuna o Strategia?
                    // Prima vittoria a difficoltà 4
                    isAchieved = games.some(game => game.user_id === userId && game.difficulty === 4 && game.game_status === 'won');
                    break;

                default:
                    break;
            }

            console.log(`Obiettivo ${objective.id}: ${isAchieved ? 'Raggiunto' : 'Non raggiunto'}`);

            if (isAchieved) {
                const existingGoal = await userGoalsDao.getUserGoal(userId,  objective.id);
                
                const goalDetails = await objectivesDao.getObjectiveById(objective.id);
        
                console.log(`Esistente goal: ${JSON.stringify(existingGoal)}`);

    if (existingGoal) {
    console.log(`Obiettivo esistente trovato:`, existingGoal);

    if (goalDetails.repeatable === 1) {
        const newCount = existingGoal.count + 1;
        await userGoalsDao.updateGoalCount(userId, objective.id, newCount);
    } else {
        console.log(`L'obiettivo ${objective.id} non è ripetibile, non incremento il count.`);
    }
} else {
    await userGoalsDao.addUserGoal(userId, objective.id, 1);
}

            }
        }
    } catch (err) {
        console.error('Errore nel controllo degli obiettivi:', err);
    }
};