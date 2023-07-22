import sqlite3
from sqlite3 import Error

class Database:
    _conn = None
    _cursor = None

    @staticmethod
    def get_conn():
        if Database._conn is None:
            try:
                Database._conn = sqlite3.connect('backend/db/db.sqlite')
                print(f'successful connection with sqlite version {sqlite3.version}')
            except Error as e:
                print(f'Error occurred during connection: {e}')
        return Database._conn

    @staticmethod
    def get_cursor():
        if Database._cursor is None:
            if Database.get_conn() is not None:
                Database._cursor = Database._conn.cursor()
        return Database._cursor
    
    @staticmethod
    def execute(query, params=None):
        cursor = Database.get_cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        Database._conn.commit()

    @staticmethod
    def insert(query, params):
        Database.execute(query, params)
        return Database._cursor.lastrowid

    @staticmethod
    def fetchall(query, params=None):
        Database.execute(query, params)
        return Database._cursor.fetchall()
    