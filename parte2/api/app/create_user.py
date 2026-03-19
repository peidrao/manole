import argparse
import getpass
import sys

from pydantic import EmailStr, ValidationError, TypeAdapter

from .utils.auth import hash_password
from .database import Base, SessionLocal, engine
from .models import User


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Cria um usuario no banco de dados')
    parser.add_argument('--email', required=True, help='E-mail do usuario')
    parser.add_argument(
        '--password',
        help='Senha do usuario. Se omitida, sera solicitada no terminal sem eco',
    )
    return parser.parse_args()


def validate_email(email: str) -> str:
    try:
        return TypeAdapter(EmailStr).validate_python(email)
    except ValidationError as exc:
        raise ValueError('E-mail invalido') from exc


def resolve_password(raw_password: str | None) -> str:
    if raw_password:
        password = raw_password
    else:
        password = getpass.getpass('Senha: ')

    if len(password) < 6:
        raise ValueError('A senha deve ter pelo menos 6 caracteres')
    return password


def main() -> int:
    args = parse_args()

    try:
        email = validate_email(args.email)
        password = resolve_password(args.password)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    # Keeps the command robust even when migrations were not applied on an existing volume.
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print('Usuario ja cadastrado com este e-mail', file=sys.stderr)
            return 1

        user = User(email=email, password_hash=hash_password(password))
        db.add(user)
        db.commit()
        print(f'Usuario criado com sucesso: {email}')
        return 0
    finally:
        db.close()


if __name__ == '__main__':
    raise SystemExit(main())
