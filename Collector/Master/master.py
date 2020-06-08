from flask import Flask, json, request
import mysql.connector
from mysql.connector import Error
import os

api = Flask(__name__)

@api.route('/register', methods=['POST'])
def register():
    content = request.json
    db = connect()
    if db != None:
    cursor = db.cursor()
    cursor.execute("INSERT INTO registration (host, pod, namespace, ip, groupname, service, port) VALUES (%s, %s, %s, %s, %s, %s, %s)", (content['host'], content['name'], content['namespace'], content['ip'], content['group'], content['service'], content['port']))
    db.commit()
    db.close()
    else:
    return json.dumps({"status": False, "message": "Unable to connect to master db"})
    return json.dumps({"status": True, "message": "OK"})

@api.route('/unregister', methods=['POST'])
def unregister():
    content = request.json
    db = connect()
    if db != None:
    cursor = db.cursor()
    cursor.execute("UPDATE registration SET active = FALSE, updated_at = NOW() WHERE host = %s AND namespace = %s", (content['host'], content['namespace']))
    db.commit()
    db.close()
    else:
    return json.dumps({"status": False, "message": "Unable to connect to master db"})
    if cursor.rowcount > 0:
    return json.dumps({"status": True, "message": "OK"})
    return json.dumps({"status": False, "message": "Unable to find pod"})

def connect():
    try:
        conn = mysql.connector.connect(host=os.environ["DB_HOST"], database=os.environ["DB_NAME"], user=os.environ["DB_USER"],password=os.environ["DB_PASSWORD"])
        if conn.is_connected():
            return conn
        return None
    except Error as e:
    return None

if __name__ == '__main__':
    api.run(host='0.0.0.0')