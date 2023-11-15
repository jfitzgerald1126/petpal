sudo apt install python3.8 python3-pip

python -m venv env

source ./env/bin/activate

pip install -r ./requirements.txt

python ./petpal/manage.py makemigrations
python ./petpal/manage.py migrate