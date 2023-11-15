PROJECT_DIR="P2/petpal"

sudo apt-get install python3.8 python3-pip

python -m venv env

source env/bin/activate

pip install -r requirements.txt

python manage.py make migrations
python manage.py migrate

deactivate