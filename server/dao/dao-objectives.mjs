import db from "../db.mjs";
/************** Objective DAO **************/

export default function ObjectivesDao() {
    
    // retrieve all the objectives 
    this.getAllObjectives = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM goals';
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err); 
                } else {
                    resolve(rows); 
                }
            });
        });
    };

    // retrieve an objective given its id
    this.getObjectiveById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM goals WHERE id = ?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err); 
                } else if (row === undefined) {
                    resolve({ error: 'Objective not found.' }); 
                } else {
                    resolve(row); 
                }
            });
        });
    };
}
