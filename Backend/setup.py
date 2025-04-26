from setuptools import setup, find_packages

setup(
    name="TetouanCars",
    packages=find_packages(),
    install_requires=[
        'flask',
        'flask-pymongo',
    ],
)