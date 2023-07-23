import sqlite3
from sqlite3 import Error
import os
from flask import g

class Database:
    @staticmethod
    def get_conn():
        if 'db_conn' not in g:
            try:
                g.db_conn = sqlite3.connect('db/db.sqlite')
                g.db_conn.row_factory = sqlite3.Row
                print(f'successful connection with sqlite version {sqlite3.version}')
            except Error as e:
                print(f'Error occurred during connection: {e}')
        return g.db_conn

    @staticmethod
    def get_cursor():
        if 'db_cursor' not in g:
            g.db_cursor = Database.get_conn().cursor()
        return g.db_cursor
    
    @staticmethod
    def execute(query, params=None, commit=True):
        cursor = Database.get_cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        if commit:
            Database.get_conn().commit()

    @staticmethod
    def insert(query, params, commit=True):
        Database.execute(query, params, commit)
        return Database.get_cursor().lastrowid

    @staticmethod
    def fetchall(query, params=None):
        Database.execute(query, params)
        return Database.get_cursor().fetchall()
    
    @staticmethod
    def close():
        db_cursor = g.pop('db_cursor', None)

        if db_cursor is not None:
            db_cursor.close()

        db_conn = g.pop('db_conn', None)

        if db_conn is not None:
            db_conn.close()