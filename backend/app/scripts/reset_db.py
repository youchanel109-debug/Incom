from app.core.database import engine, Base


def reset_database():
    print('Dropping and recreating database tables...')
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print('Database reset complete.')


if __name__ == '__main__':
    reset_database()
