import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="switchback.proxy.rlwy.net",
        user="root",
        password="XyYLLvjsmJTWkkzJrpwlUIUyJExrOReM",
        database="railway",
        port=29623
    )