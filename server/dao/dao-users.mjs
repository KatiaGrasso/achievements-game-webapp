import db from "../db.mjs";
import crypto from "crypto";

export default function UserDao() {


    this.getUserByCredentials = (email, password) => {
      return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM users WHERE email=?';
          db.get(sql, [email], (err, row) => {
              if (err) {
                  reject(err);
              } else if (row === undefined) {
                  resolve(false);
              }
              else {
                  const user = { id: row.id, username: row.email, name: row.name };

                  // Check the hashes with an async call
                  crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { 
                      if (err) reject(err);
                      if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) 
                          resolve(false);
                      else
                          resolve(user);
                  });
              }
          });
      });
  }

}