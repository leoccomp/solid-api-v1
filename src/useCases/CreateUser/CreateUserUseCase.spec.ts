import { CreateUserUseCase } from './CreateUserUseCase';
import { IUsersRepository } from './../../repositories/IUsersRepository';
import { IMailProvider } from './../../providers/IMailProvider';
import { ICreateUserRequestDTO } from './CreateUserDTO';
import { User } from '../../entities/User';

const makeUsersRepository = (): IUsersRepository => {
    return {
        findByEmail: jest.fn(),
        save: jest.fn()
    };
};

const makeMailProvider = (): IMailProvider => {
    return {
        sendMail: jest.fn()
    };
};

describe('CreateUserUseCase', () => {
    let createUserUseCase: CreateUserUseCase;
    let usersRepository: IUsersRepository;
    let mailProvider: IMailProvider;

    beforeEach(() => {
        usersRepository = makeUsersRepository();
        mailProvider = makeMailProvider();
        createUserUseCase = new CreateUserUseCase(usersRepository, mailProvider);
    });

    it('should create a new user', async () => {
        const userData: ICreateUserRequestDTO = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123'
        };

        (usersRepository.findByEmail as jest.Mock).mockResolvedValue(null);

        await createUserUseCase.execute(userData);

        expect(usersRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(usersRepository.save).toHaveBeenCalledWith(expect.any(User));
        expect(mailProvider.sendMail).toHaveBeenCalledWith({
            to: {
                name: userData.name,
                email: userData.email
            },
            from: {
                name: 'Equipe do meu app',
                email: 'equipe@example.com'
            },
            subject: 'Seja bem vindo a plataforma!',
            body: '<h1>Você já pode fazer login em nossa plataforma!</h1>'
        });
    });

    it('should not create a user if email already exists', async () => {
        const userData: ICreateUserRequestDTO = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123'
        };

        (usersRepository.findByEmail as jest.Mock).mockResolvedValue(new User(userData));

        await expect(createUserUseCase.execute(userData)).rejects.toThrow('User already exists');
        expect(usersRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(usersRepository.save).not.toHaveBeenCalled();
        expect(mailProvider.sendMail).not.toHaveBeenCalled();
    });
});