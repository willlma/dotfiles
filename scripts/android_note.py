import os
from datetime import datetime, timedelta

# Lines pasted from note.py
date = datetime.today()
filename = os.environ["NOTES_DIRECTORY"]
filename += date.strftime('%Y%m%d')
filename += '.md'
os.system(f'termux-open {filename}')
