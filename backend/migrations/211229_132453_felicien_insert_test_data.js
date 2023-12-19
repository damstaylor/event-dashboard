import { v4 as uuid } from "uuid";

export default {
  up: async (q) => {
    await q.sequelize.query(
      `INSERT INTO Events (id, name) VALUES
        ('${uuid()}', 'Example Event 1'),
        ('${uuid()}', 'Example Event 2');`
    );
    await q.sequelize.query(
      `INSERT INTO Users (id, phone_number, first_name, last_name, registration_number, last_connected, event_id)
        SELECT '${uuid()}', '+33612345678', 'John', 'Doe', '12345678', NULL, id
        FROM Events WHERE name='Example Event 1';`
    );
    await q.sequelize.query(
      `INSERT INTO Users (id, phone_number, first_name, last_name, registration_number, last_connected, event_id)
        SELECT '${uuid()}', '+33600000000', 'Jean', 'Dupont', '12345', NULL, id
        FROM Events WHERE name='Example Event 2';`
    );
  },
  down: async () => {},
};
