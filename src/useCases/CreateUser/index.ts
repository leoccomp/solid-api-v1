import { MailTrappMailProvider } from "../../providers/implementations/MailTrapMailProvider";
import { PostgresUsersRepository } from "../../repositories/implementations/PostgresUsersRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

const mailTrapProvider = new MailTrappMailProvider();
const postgresUserRepository = new PostgresUsersRepository();

const createUserUseCase = new CreateUserUseCase(
    postgresUserRepository,
    mailTrapProvider
);

const createUserController = new CreateUserController(
    createUserUseCase
)

export {  createUserController, createUserUseCase }
