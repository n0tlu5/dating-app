import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'dating_app',
  entities: ['dist/**/*.entity.js'], // Path to compiled entities
  migrations: ['dist/migrations/*.js'], // Path to compiled migrations
  synchronize: false, // Use migrations for schema changes
  logging: true,
});

export default dataSource;
