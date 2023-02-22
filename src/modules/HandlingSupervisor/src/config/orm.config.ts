import { DataSource } from "typeorm";

export const ORMConnection = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "edgar",
  password: "20012002",
  database: "handling_supervisor",
  synchronize: true,
  //   entities: [User],
});
