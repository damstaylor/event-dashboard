import { v4 as uuid } from "uuid";

export default {
  up: async (q) => {
    await q.sequelize.query(
      `INSERT INTO events (id, name) VALUES
        ('${uuid()}', 'Example Event 1'),
        ('${uuid()}', 'Example Event 2');`
    );
    await q.sequelize.query(
      `INSERT INTO users (id, phone_number, first_name, last_name, last_connected, eventId)
        SELECT '${uuid()}', '+33612345678', 'John', 'Doe', NULL, id
        FROM events WHERE name='Example Event 1';`
    );
    await q.sequelize.query(
      `INSERT INTO users (id, phone_number, first_name, last_name, last_connected, eventId)
        SELECT '${uuid()}', '+33600000000', 'Jean', 'Dupont', NULL, id
        FROM events WHERE name='Example Event 2';`
    );
  },
  down: async () => {},
};
