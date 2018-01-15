from setuptools import setup, find_packages

# Setup configuration for the tool
setup(
    name='OEDA-Backend',
    version='0.2',
    long_description="",
    packages=find_packages(),
    include_package_data=False,
    zip_safe=False,
    install_requires=[
        'colorama',
        'tornado',
        'flask_restful',
        'flask_cors',
        'elasticsearch5',
        'matplotlib',
        'statsmodels',
        'numpy',
        'requests',
        'rpy2==2.7.8',
        'pyjwt'
    ]
)
