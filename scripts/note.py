#!/usr/bin/env python3

import argparse, os
from datetime import datetime, timedelta

parser = argparse.ArgumentParser(description='Create a note')
parser.add_argument('text', nargs='?')
parser.add_argument('-c', '--cont', const=True, default=False, nargs='?')
parser.add_argument('-t', '--title')
parser.add_argument('-w', '--work', const=True, default=False, nargs='?')
parser.add_argument('-y', '--yesterday', const=True, default=False, nargs='?')
args = parser.parse_args()

date = datetime.today()
filename = os.environ["NOTES_DIRECTORY"]

if args.work:
    filename += 'fh/'

if args.yesterday:
    date -= timedelta(days=1)

filename += date.strftime('%Y%m%d')

if args.title:
    filename += f'{date.strftime("_%H%M")}_{args.title}'

filename += '.md'

if args.text:
    file = open(filename, 'a')
    file.write(f'{args.text}\n')
    file.close()


if not args.text or args.cont:
    os.system(f'code $NOTES_DIRECTORY {filename}')
