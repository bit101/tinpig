from logger import Logger

logger = Logger()
logger.log("hello")
logger.log("goodbye")
logger.print_messages()

logger.log("something else")
print("")
logger.print_messages()
