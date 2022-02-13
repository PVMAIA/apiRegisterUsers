const UserRepository = require('../repositories/UserRepository');
const firestore = require('../../utils/firestore');

class UserController {
   async index(request, response) {
      const { orderBy } = request.query;
      const users = await UserRepository.findAll(orderBy);

      response.json(users);
   }

   async show(request, response) {
      const { id } = request.params;

      const user = await UserRepository.findById(id);

      if (!user) {
         return response.status(404).json({ error: 'User not found' });
      }

      return response.json(user);
   }

   async store(request, response) {
      const {
         name, code, dateOfBirth,
      } = request.body;

      if (!name) {
         return response.status(400).json({ error: 'Name is required' });
      }

      if (!code) {
         return response.status(400).json({ error: 'Code is required' });
      }

      if (!dateOfBirth) {
         return response.status(400).json({ error: 'Date of birth is required' });
      }

      if (!request.file) {
         return response.status(400).json({ error: 'Photo is required' });
      }

      const userExists = await UserRepository.findByCode(code);
      if (userExists) {
         return response
            .status(400)
            .json({ error: 'This code is already in use' });
      }

      const photo = await firestore.storageImage(request.file);

      const user = await UserRepository.create({
         name, code, dateOfBirth, photo,
      });

      return response.json(user);
   }

   async update(request, response) {
      const { id } = request.params;
      const {
         name, code, dateOfBirth,
      } = request.body;
      const photo = request.file;
      let newPhoto = '';

      let user = await UserRepository.findById(id);
      if (!user) {
         return response.status(400).json({ error: 'User not found' });
      }

      const userByCode = await UserRepository.findByCode(code);

      if (userByCode && userByCode.id !== id) {
         return response.status(400).json({ error: 'This code is already in use' });
      }

      if (photo) {
         newPhoto = await firestore.storageImage(photo);
         user = await UserRepository.updateUserPhoto(id, { newPhoto });
      }

      if (!name) {
         return response.status(400).json({ error: 'Name is required' });
      }

      if (!code) {
         return response.status(400).json({ error: 'Code is required' });
      }

      if (!dateOfBirth) {
         return response.status(400).json({ error: 'Date of birth is required' });
      }

      if (userByCode.name !== name || userByCode.code !== code || userByCode.dateOfBirth !== dateOfBirth) {
         user = await UserRepository.updateUserData(id, { name, code, dateOfBirth });
      }

      return response.json(user);
   }

   async delete(request, response) {
      const { id } = request.params;

      await UserRepository.delete(id);
      return response.sendStatus(204);
   }
}

module.exports = new UserController();
