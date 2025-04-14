#!/bin/sh
(trap 'gradle --stop' SIGINT; gradle bootRun & gradle -t classes & wait)
