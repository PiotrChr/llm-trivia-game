import sqlite3
from sqlite3 import Error
import os
from flask import g, has_app_context

class Database:
    _conn = None
    _cursor = None

    @staticmethod
    def _is_flask_context():
        return has_app_context()

    @classmethod
    def get_conn(cls):
        if cls._is_flask_context():
            if 'db_conn' not in g:
                g.db_conn = sqlite3.connect('db/db.sqlite')
                g.db_conn.row_factory = sqlite3.Row
            return g.db_conn
        else:
            if cls._conn is None:
                cls._conn = sqlite3.connect('db/db.sqlite')
                cls._conn.row_factory = sqlite3.Row
            return cls._conn

    @classmethod
    def get_cursor(cls):
        if cls._is_flask_context():
            if 'db_cursor' not in g:
                g.db_cursor = cls.get_conn().cursor()
            return g.db_cursor
        else:
            if cls._cursor is None:
                cls._cursor = cls.get_conn().cursor()
            return cls._cursor
    
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
    
    @classmethod
    def close(cls):
        if cls._is_flask_context():
            db_cursor = g.pop('db_cursor', None)
            if db_cursor:
                db_cursor.close()

            db_conn = g.pop('db_conn', None)
            if db_conn:
                db_conn.close()
        else:
            if cls._cursor:
                cls._cursor.close()
                cls._cursor = None

            if cls._conn:
                cls._conn.close()
                cls._conn = None