# Observe
Observe is a utility that allows you to create graphs through a simple API interface, the window does not have to be created / destroyed each time you run an experiement, and window size and position are persisted.

This allows you to restart and view graphs programatically without all that annoying resizing and moving of windows. 

Here's some code that generates temperature / pressure values and then graphs them in realtime
```
#!/usr/bin/env python

import requests
import time
import random

url = 'http://127.0.0.1:12768'

for i in range(15):
    point = {'x': 10 * i, 'y': 2 *random.random(), 'dataset': 'TEMP'}
    print(point)
    requests.post(url + '/point', point)
    
    point = {'x': 10 * i, 'y': 2 *random.random(), 'dataset': 'PRESSURE'}
    print(point)
    requests.post(url + '/point', point)
    
    time.sleep(0.1);
```

![Observe Demo](https://github.com/AtomicTessellator/observe/raw/main/demo/observe_demo.gif)
