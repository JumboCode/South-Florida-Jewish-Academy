#!/usr/bin/env python3

# run with python3 resetDatabase.py
from pymongo import MongoClient
import subprocess

def main():

    ## drop and remake database
    try:
        client = MongoClient('localhost', 27017, serverSelectionTimeoutMS=10)
        client.server_info()
    except:
        print('Please start database with sh startDatabase.sh before resetting it')
        exit(1)

    try:
        client.drop_database('sfja')
        print('sfja database dropped')
    except:
        exit(1)

    db = client['sfja']
    print('Made sfja databse')

    ## make collections
    subprocess.call('mongorestore dump/', shell=True)


if __name__ == '__main__':
    main()

