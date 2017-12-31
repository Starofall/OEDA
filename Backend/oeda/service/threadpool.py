# python 2.7 compatible thread pool implementation from
# @ https://www.metachris.com/2016/04/python-threadpool/
# also: https://eli.thegreenplace.net/2011/12/27/python-threads-communication-and-stopping

from oeda.log import *
from threading import Thread, Event

IS_PY2 = sys.version_info < (3, 0)

if IS_PY2:
    from Queue import Queue
else:
    from queue import Queue


threadpool = None


def getCachedThreadPool():
    global threadpool
    if threadpool is None:
        debug("Creating new threadpool")
        threadpool = ThreadPool(20)
        return threadpool
    else:
        debug("Using cached threadpool")
        return threadpool


class Worker(Thread):
    """ Thread executing tasks from a given tasks queue """

    def __init__(self, tasks, workers):
        Thread.__init__(self)
        self.tasks = tasks
        self.workers = workers
        self.oeda_stop_request = Event()
        self.daemon = True
        self.start()

    def set_stop_request(self):
        self.oeda_stop_request.set()

    def run(self):
        while True:
            func, args, kargs = self.tasks.get()
            try:
                # We add the current thread to the queue of working threads
                experiment_id = args[0]["id"]
                self.workers.put((experiment_id,self))
                # We pass the flag in order to use is inside the function to send interruption signals
                args += (self.oeda_stop_request,)
                func(*args, **kargs)
            except Exception as e:
                # An exception happened in this thread
                print(e)
            finally:
                # Mark this task as done, whether an exception happened or not
                self.tasks.task_done()


class ThreadPool:
    """ Pool of threads consuming tasks from a queue """

    def __init__(self, num_threads):
        self.tasks = Queue(num_threads)
        self.active_workers = Queue(num_threads)
        for _ in range(num_threads):
            Worker(self.tasks, self.active_workers)

    def add_task(self, func, *args, **kargs):
        """ Add a task to the queue """
        self.tasks.put((func, args, kargs))

    def kill_thread(self, experiment_id_to_remove):
        """ Kills a thread that is currently running an experiment """
        # We look into the queue of working threads for the thread that runs the experiment we want to stop
        for _ in range(self.active_workers.qsize()):
            experiment_id, experiment_thread = self.active_workers.get()
            if experiment_id == experiment_id_to_remove:
                experiment_thread.set_stop_request()
            else:
                # this is not the thread we want to stop, just put it back in the queue
                self.active_workers.put((experiment_id, experiment_thread))

    def map(self, func, args_list):
        """ Add a list of tasks to the queue """
        for args in args_list:
            self.add_task(func, args)

    def wait_completion(self):
        """ Wait for completion of all the tasks in the queue """
        self.tasks.join()
