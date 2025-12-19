from subprocess import Popen

main_script = Popen(['python3 ./main/main.py']) # something long running
dashboard_serve = Popen(['node', './dashboard-serve/dist/index.js'])

try:
    while (True):
        dashboard_poll = dashboard_serve.poll() 
        main_script_poll = main_script.poll() 
            
        if (dashboard_poll == None):
            print("Dashboard ended")
            break;
        if (main_script_poll == None):
            print("main script ended")
            break;

finally:
    dashboard_serve.terminate() 
    main_script.terminate() 
