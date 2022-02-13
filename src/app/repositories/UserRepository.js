const db = require('../../database');

class UserRepository {
   async findAll(orderBy = 'ASC') {
      const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const rows = await db.query(`
         SELECT users.*, to_char(users.dateOfBirth, 'DD/MM/YYYY') as dateOfBirth
         FROM users
         ORDER BY users.name ${direction}
      `);
      return rows;
   }

   async findById(id) {
      const [row] = await db.query(
         `
         SELECT users.*
         FROM users
         WHERE users.id = $1
      `,
         [id],
      );
      return row;
   }

   async findByCode(code) {
      const [row] = await db.query('SELECT * FROM users WHERE code = $1', [
         code,
      ]);
      return row;
   }

   async create({
      name, code, dateOfBirth, photo,
   }) {
      const [row] = await db.query(
         `
         INSERT INTO users(name, code, dateOfBirth, photo)
         VALUES($1, $2, $3, $4)
         RETURNING *
      `,
         [name, code, dateOfBirth, photo],
      );

      return row;
   }

   async updateUserData(id, {
      name, code, dateOfBirth,
   }) {
      const [row] = await db.query(
         `
         UPDATE users
         SET name = $1, code = $2, dateOfBirth = $3
         WHERE id = $4
         RETURNING *
      `,
         [name, code, dateOfBirth, id],
      );
      return row;
   }

   async updateUserPhoto(id, { newPhoto }) {
      const [row] = await db.query(
         `
      UPDATE users
      SET photo = $1
      WHERE id = $2
      RETURNING *
   `,
         [newPhoto, id],
      );
      return row;
   }

   async delete(id) {
      const deleteOp = await db.query('DELETE FROM users WHERE id = $1', [id]);
      return deleteOp;
   }
}

module.exports = new UserRepository();
