from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os 

load_dotenv() 

DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL, echo=True)

Base = declarative_base()
SessionLocal = sessionmaker(bind=engine, autoflush=True)

db_session = SessionLocal()

try: 
    connection = engine.connect()
    connection.close()
    print("ping, connected")
except Exception as e:
    print(f"Error: {str(e)}")


