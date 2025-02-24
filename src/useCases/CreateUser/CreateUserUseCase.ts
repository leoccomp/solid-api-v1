import { User } from '../../entities/User';
import { IMailProvider } from '../../providers/IMailProvider';
import { IUsersRepository } from './../../repositories/IUsersRepository';
import { ICreateUserRequestDTO } from './CreateUserDTO';
export class CreateUserUseCase {
    constructor(
        private readonly usersRepository: IUsersRepository,
        private readonly mailProvider: IMailProvider
    ) {
        
    }
    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

        if (userAlreadyExists) {
            throw new Error('User already exists');
        }

        const user = new User(data);

        await this.usersRepository.save(user);

        await this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email
            },
            from: {
                name: 'Equipe do meu app',
                email: 'equipe@example.com'
            },
            subject: 'Seja bem vindo a plataforma!',
            body: '<h1>Você já pode fazer login em nossa plataforma!</h1>'
        })
    }
}