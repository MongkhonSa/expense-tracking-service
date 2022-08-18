import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import postgresConfig from './postgresConfig';

const source = new DataSource({
  type: 'postgres',
  host: postgresConfig.host,
  port: postgresConfig.port,
  username: postgresConfig.username,
  password: postgresConfig.password,
  database: postgresConfig.databaseName,
  entities: ['src/**/*.entity.{js,ts}'],
  migrations: ['src/migrations/*.{js,ts}'],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
});

export default source;
