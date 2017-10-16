cd ..\Frontend
call build.bat
cd ..\Build
mkdir app
mkdir app\static
move ..\Frontend\dist .\app\static
