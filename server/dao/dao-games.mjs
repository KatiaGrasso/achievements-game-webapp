/* DAO module for accessing games data */
import db from "../db.mjs";
import Game from "../Game.mjs";

/************** Game DAO **************/
export default function GameDao() {

     // This function adds a new game in the database
     
    this.addGame = (game) =>{
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO games (user_id, difficulty, attempts, secret_number, game_status) VALUES (?, ?, ?, ?, ?)';
            db.run(query, [game.user_id, game.difficulty, game.attempts, game.secret_number, game.game_status], function (err) {
            if (err) {
                reject(err);
                }
            game.id = this.lastID
            resolve(game)
            });
        })
    }   
    // retrieves all games in the database
     
    this.getAllGames = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM games';
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
    
    
    // updates a game

    this.updateGame = (id, updatedGame) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE games SET user_id = ?,attempts = ?, game_status = ? WHERE id = ?';
            db.run(query, [updatedGame.user_id, updatedGame.attempts, updatedGame.game_status, id], function(err) {
                if (err) {
                    reject(err);
                }
                updatedGame.id = id;
                resolve(updatedGame);
            });
        });
    }

}