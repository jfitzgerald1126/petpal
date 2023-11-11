PROJECT_DIR="P2/petpal"

python -m venv env

source env/bin/activate

pip install -r requirements.txt

python manage.py make migrations
python manage.py migrate

deactivate